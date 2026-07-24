const BASE_URI = "https://swdev-hardy.com/api/auto-store";

const isExtensionEnabled = localStorage.getItem("popupEnabled") !== "false";
if (isExtensionEnabled) {
  createStickyNote();
  fetchAndDisplayPrice();
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "getCarData") {
    fetchCarData().then(sendResponse);
    return true;
  }
  if (request.action === "setEnabled") {
    localStorage.setItem("popupEnabled", request.enabled ? "true" : "false");
    const stickyNote = document.getElementById("car-calculator-sticky-note");

    if (request.enabled && !stickyNote) {
      createStickyNote();
      fetchAndDisplayPrice();
    } else if (!request.enabled && stickyNote) {
      stickyNote.remove();
    }
  }
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "getCarData") {
    fetchCarData().then(sendResponse);
    return true;
  }
});

function extractCarIdFromUrl() {
  const pathname = window.location.pathname;
  // Match both /detail/{id} and /{id} patterns
  const match = pathname.match(/\/(?:detail\/)?(\d+)(?:\/|$)/);
  return match ? match[1] : null;
}

async function fetchCarData() {
  const carId = extractCarIdFromUrl();
  if (!carId) {
    console.error("Could not extract car ID from URL");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URI}/v1/auto-api/cars/${carId}/import-calculation`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch car data:", error);
    return null;
  }
}

async function fetchAndDisplayPrice() {
  setStickyNoteLoader();
  const data = await fetchCarData();

  if (data?.calculation?.totalUSD) {
    setStickyNotePrice(
      data.calculation.totalUSD,
      data.calculation.totalUSD * data.exchangeRates.usdToEur,
      data.calculation.totalUSD * data.exchangeRates.usdToMdl
    );
  }
}

function createStickyNote() {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    const note = document.createElement("div");

    note.id = "car-calculator-sticky-note";
    note.style.cssText = `
      position: fixed;
      top: 110px;
      left: 5px;
      background-color: white;
      border: 2px solid rgb(255, 80, 0);
      color: rgb(255, 80, 0);
      padding: 0 5px;
      font-size: 22px;
      white-space: nowrap;
      text-align: center;
      border-radius: 8px;
      font-family: sans-serif;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
      z-index: 10000;
      width: 140px;
      height: 60px;
      padding-top: 2px;
      transition: transform 0.3s ease-in-out;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      line-height: 1;
      font-family: 'Pretendard', sans-serif;
    `;

    document.body.appendChild(note);
    setStickyNoteLoader();
  }
}

function setStickyNoteLoader() {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    return;
  }

  const loaderSrc = "https://swdev-hardy.com/ui/auto-store-fees/assets/loading.svg";

  stickyNote.innerHTML = `<img style="width: 25px; height: 25px; object-fit: contain;" src="${loaderSrc}"/>`;
}

function setStickyNotePrice(priceUSD, priceEUR, priceMDL) {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    return;
  }

  const logoSrc = "https://swdev-hardy.com/ui/auto-store-fees/assets/favicon/favicon-32x32.png";

  stickyNote.innerHTML = `
    <div
      style="
        display: flex;
        align-items: center;
        gap: 5px;
        flex: 1;
      "
    >
      <img style="width: 20px; height: 20px; object-fit: none;" src="${logoSrc}"/>

      <div style="
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        line-height: 1;
      ">
        <span>$ ${priceUSD.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        <sub style="color: black; font-size: 12px">€ ${priceEUR.toLocaleString("en-US", { maximumFractionDigits: 0 })}</sub>
        <sub style="color: black; font-size: 12px">L ${priceMDL.toLocaleString("en-US", { maximumFractionDigits: 0 })}</sub>
      </div>
    </div>

    <div
      id="toggle-sticky-btn"
      style="
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        background: white;
        border: 2px solid rgb(255, 80, 0);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-style: normal;
        text-align: center;
        font-size: 12px;
        line-height: 20px;
      "
    >
      <div
        style="
          display: block;
          position: absolute;
          left: 0;
          top: 50%;
          background: white;
          height: 30px;
          width: 15px;
          transform: translate(-5px, -50%);
        ">
      </div>
      <span id="toggle-arrow" style="position: relative; display: inline-block; transition: transform 0.3s ease;">
        &#9665
      </span>
    </div>
    `;

    const toggleBtn = stickyNote.querySelector("#toggle-sticky-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleSticker);
    }
  }

function toggleSticker() {
  const stickyNote = document.getElementById("car-calculator-sticky-note");
  if (!stickyNote) {
    return;
  }

  const arrow = stickyNote.querySelector("#toggle-arrow");
  const isHidden = stickyNote.dataset.hidden === "true";

  if (isHidden) {
    stickyNote.style.transform = "translateY(-50%) translateX(0)";
    stickyNote.dataset.hidden = "false";
    if (arrow) arrow.style.transform = "rotate(0deg)";
  } else {
    stickyNote.style.transform = "translateY(-50%) translateX(-95%)";
    stickyNote.dataset.hidden = "true";
    if (arrow) arrow.style.transform = "rotate(180deg)";
  }
}

window.toggleSticker = toggleSticker;
