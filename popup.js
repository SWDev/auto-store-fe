window.addEventListener("DOMContentLoaded", async () => {
  const loader = document.querySelector(".loading");
  const KRWInput = document.querySelector("#KRWInput");
  const EURInput = document.querySelector("#EURInput");

  const exchangeRateWON = await setExchangeRate({
    loader,
    KRWInput,
    EURInput,
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "popupOpened", exchangeRateWON },
      (response) => {
        loader.style.display = "block";

        updateExchangeRatesDisplay(response);
      }
    );
  });

  document.getElementById("calculateBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const exchangeRateWON = KRWInput.value;
      const exchangeRateEUR = EURInput.value;

      localStorage.setItem("exchangeRateWON", exchangeRateWON);
      localStorage.setItem("exchangeRateEUR", exchangeRateEUR);

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getPrice", exchangeRateWON },
        (response) => {
          updateExchangeRatesDisplay(response);
        }
      );
    });
  });
});

function updateExchangeRatesDisplay(response) {
  generatePriceBreakdownTable(response);
  setFinalPrice(response?.finalPrice);
}

function generatePriceBreakdownTable(response) {
  const loader = document.querySelector(".loading");
  const table = document.querySelector("#priceBreakdown");

  table.innerHTML = `
        <tr>
            <td>Preț cumpărare</td>
            <td><span>${getPriceInEur(response?.price)}</span></td>
        </tr>
        <tr>
            <td>Taxa devamare</td>
            <td><span>${getPriceInEur(response?.importTax)}</span></td>
        </tr>
        <tr>
            <td>Preț logistică</td>
            <td><span>${getPriceInEur(response?.shippingFee)}</span></td>
        </tr>
    `;

  if (response?.luxuryTax) {
    table.innerHTML += `
        <tr>
            <td>Taxa de lux</td>
            <td><span>${getPriceInEur(response?.luxuryTax)}</span></td>
        </tr>
    `;
  }

  loader.style.display = "none";
}

function setFinalPrice(price) {
  const finalPrice = document.querySelector("#finalPrice");

  finalPrice.innerText = getPriceInEur(price);
}

function getPriceInEur(price) {
  if (price === undefined || price === null) {
    return "🤷‍♀️";
  }

  const eur = price / localStorage.getItem("exchangeRateEUR");

  return `€${eur.toFixed()}`;
}

async function setExchangeRate({ loader, KRWInput, EURInput }) {
  const exchangeRateDate = localStorage.getItem("exchangeRateDate");

  if (!exchangeRateDate || isExpiredExchangeRate(new Date(exchangeRateDate))) {
    loader.style.display = "block";

    const exchangeResponse = await fetch(
      "https://swdev-hardy.com/api/auto-store/v1/exchange"
    );
    const exchangeData = await exchangeResponse.json();
    const eurToMDL = 1 / exchangeData.EUR;

    localStorage.setItem("exchangeRateDate", new Date().toISOString());
    localStorage.setItem("exchangeRateWON", exchangeData.KRW.toFixed(4) || 83);
    localStorage.setItem("exchangeRateEUR", eurToMDL.toFixed(4) || 19);

    loader.style.display = "none";
  }

  const exchangeRateWON = localStorage.getItem("exchangeRateWON");
  const exchangeRateEUR = localStorage.getItem("exchangeRateEUR");

  KRWInput.value = exchangeRateWON;
  EURInput.value = exchangeRateEUR;

  return exchangeRateWON;
}

function isExpiredExchangeRate(dateToCheck) {
  const today = new Date();
  const exchangeRateUpdateTime = new Date(today);

  exchangeRateUpdateTime.setDate(today.getDate());
  exchangeRateUpdateTime.setHours(0, 0, 0, 0);

  return dateToCheck.getTime() < exchangeRateUpdateTime.getTime();
}
