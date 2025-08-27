var asFeesIndices = {
  cargoInsurance: 0,
  greenMark: 1,
};

const metrics = [
  { en: "year", kr: "연식" },
  { en: "displacement", kr: "배기량" },
  { en: "fuel", kr: "연료" },
  { en: "type", kr: "차종" },
  { en: "mileage", kr: "주행거리" },
];

createStickyNote();
calculateOnLoad();

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "popupOpened" || request.action === "getPrice") {
    updateExchangeRatesDisplay(request);
    setStickyNoteLoader();

    const intervalId = setInterval(() => {
      document.querySelector(".DetailSummary_btn_detail__msm-h")?.click();

      if (document.querySelector(".BottomSheet-module_close_btn__FNC9C")) {
        clearInterval(intervalId);

        const calculated = calculatePriceWithFees(request.exchangeRateWON);

        sendResponse(calculated);
      }
    }, 300);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 20000);

    return true;
  }
});

async function calculateOnLoad() {
  await setImportTax();
  await setASFees();
  await setExchangeRate();

  const intervalId = setInterval(() => {
    document.querySelector(".DetailSummary_btn_detail__msm-h")?.click();

    if (document.querySelector(".BottomSheet-module_close_btn__FNC9C")) {
      clearInterval(intervalId);
      calculatePriceWithFees(localStorage.getItem("exchangeRateWON"));
      document.querySelector(".BottomSheet-module_close_btn__FNC9C")?.click();
    }
  }, 200);

  setTimeout(() => {
    clearInterval(intervalId);
  }, 20000);
}

function calculatePriceWithFees(exchangeRateWON) {
  let wonPrice = document.querySelector(".DetailLeadCase_point__vdG4b").innerText;

  if (wonPrice.includes(",")) {
    wonPrice = +wonPrice.replace(/,/g, "") / 100;
  }

  const purchasedPriceInMDL = (+wonPrice * 1_000_000) / exchangeRateWON;
  const params = Array.from(document.querySelectorAll("#bottom_sheet li"));
  const aggregatedPrice = calculate({ params, purchasedPriceInMDL });

  return aggregatedPrice;
}

function calculate(options) {
  const { params, purchasedPriceInMDL } = options;
  const dataParams = params.map((param) => param.innerText.toLowerCase().split("\n"));
  const carData = metrics
    .map((metric) => {
      const pairs = dataParams.find((pair) => pair[0].includes(metric.en) || pair[0].includes(metric.kr));

      if (!pairs) return null;

      return {
        [metric.en]: pairs[1],
      };
    })
    .reduce((acc, line) => {
      return {
        ...acc,
        ...line,
      };
    }, {});

  const { displacementTax, luxuryTax, ASFee } = calculateTaxes(carData, purchasedPriceInMDL);
  const response = {
    acquisitionPrice: purchasedPriceInMDL,
    importTax: displacementTax,
    luxuryTax,
    ASFee,
    totalPrice: +purchasedPriceInMDL + +displacementTax + +luxuryTax + +ASFee.total,
  };

  setStickyNoteLogoAndPrice(response.totalPrice);

  return response;
}

function findLowest(object, number) {
  if (!object) return 0;

  const keys = Object.keys(object);

  for (let i = keys.length - 1; i >= 0; i--) {
    if (keys[i] <= number) {
      return object[keys[i]];
    }
  }

  return object[keys[0]];
}

function calculateTaxes(data, purchasedPriceInMDL) {
  const importTax = JSON.parse(localStorage.getItem("importTax"));
  const carAge = getAge(data.year);
  const fuel = getFuel(data.fuel);
  const displacement = getDisplacement(data.displacement);
  const bodyType = getBodyType(data.type);
  const yearTax = importTax[fuel]?.age[carAge - 1];
  const displacementTax = findLowest(yearTax?.displacement, displacement) * displacement;
  const luxuryTax =
    purchasedPriceInMDL >= 600_000 ? findLowest(importTax.luxury, purchasedPriceInMDL) * purchasedPriceInMDL : 0;
  const ASFee = calculateASFees(purchasedPriceInMDL, bodyType);

  return {
    displacementTax,
    luxuryTax,
    ASFee,
  };
}

function calculateASFees(mdlPrice, bodyType) {
  const fees = JSON.parse(localStorage.getItem("asFees"));
  const eurPrice = mdlPrice / (localStorage.getItem("exchangeRateEUR") || 19);
  const cargoInsurance = getFeeFromColumn(fees[asFeesIndices.cargoInsurance].columns, bodyType);
  const greenMark = getFeeFromColumn(fees[asFeesIndices.greenMark].columns, bodyType);

  let SVGCommission = 0;

  for (let index = 2; index < fees.length; index++) {
    const fee = fees[index];
    const ceiling = +fee.id.replace(/svg_/, "").split("_")[1].replace(/k/, "000");

    if (eurPrice <= ceiling) {
      SVGCommission = getFeeFromColumn(fee.columns, bodyType);

      return returnAggregatedASFees({
        cargoInsurance,
        greenMark,
        SVGCommission,
        mdlPrice,
      });
    }
  }

  return returnAggregatedASFees({
    cargoInsurance,
    greenMark,
    SVGCommission,
    mdlPrice,
  });
}

function returnAggregatedASFees({ cargoInsurance, greenMark, SVGCommission, mdlPrice }) {
  const insurance = +mdlPrice * (+cargoInsurance / 100);

  return {
    total: insurance + greenMark + SVGCommission,
    cargoInsurance: insurance,
    greenMark,
    SVGCommission,
  };
}

function getFeeFromColumn(columns, bodyType) {
  return columns[Object.keys(columns).find((one) => one.toLowerCase()?.includes(bodyType))];
}

function getBodyType(type) {
  if (type === "suv") return "suv";
  if (type?.includes("rv") || type?.includes("차")) return "minivan";

  return "sedan";
}

function getFuel(fuel) {
  return getFuelType(fuel);
}

function getAge(year) {
  let yearValue = new Date().getFullYear();

  if (!year.includes("년")) {
    yearValue = year.replace(/\D/g, "");
  } else {
    yearValue = `20${year.slice(0, 2)}`;
  }

  return new Date().getFullYear() - yearValue;
}

function getDisplacement(displacement) {
  return parseInt(displacement.replace(/\D/g, ""));
}

function getFuelType(fuel) {
  if (fuel.includes("electric") || fuel.includes("전기")) return "electric";
  if (fuel.includes("hybrid") || fuel.includes("하이브리드")) return "hybrid";
  if (fuel.includes("gasoline + electric") || fuel.includes("가솔린+전기")) return "hybrid";
  if (fuel.includes("diesel + electric") || fuel.includes("디젤 + 전기")) return "hybrid";
  if (fuel.includes("diesel") || fuel.includes("디젤")) return "diesel";
  if (fuel.includes("petrol") || fuel.includes("휘발유")) return "petrol";
  if (fuel.includes("gasoline") || fuel.includes("가솔린")) return "petrol";
}

function createStickyNote() {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    const stickyNote = document.createElement("div");

    stickyNote.id = "car-calculator-sticky-note";
    stickyNote.style.cssText = `
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
      width: 125px;
      transition: transform 0.3s ease-in-out;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      line-height: 1;
      height: 38px;
      font-family: 'Pretendard', sans-serif;
    `;

    document.body.appendChild(stickyNote);

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

function setStickyNoteLogoAndPrice(price) {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    return;
  }

  const logoSrc = "https://swdev-hardy.com/ui/auto-store-fees/assets/favicon/favicon-32x32.png";

  const priceInEUR = (price / localStorage.getItem("exchangeRateEUR")).toFixed();

  stickyNote.innerHTML = `
      <img style="width: 20px; height: 20px; object-fit: none;" src="${logoSrc}"/>
      <span>${priceInEUR}€</span>
    `;
}

function isExpiredExchangeRate(dateToCheck) {
  const today = new Date();
  const exchangeRateUpdateTime = new Date(today);

  exchangeRateUpdateTime.setDate(today.getDate());
  exchangeRateUpdateTime.setHours(0, 0, 0, 0);

  return dateToCheck.getTime() < exchangeRateUpdateTime.getTime();
}

function updateExchangeRatesDisplay(request) {
  const { exchangeRateWON, exchangeRateEUR } = request;
  const storedWON = localStorage.getItem("exchangeRateWON");
  const storedEUR = localStorage.getItem("exchangeRateEUR");

  if (storedWON !== exchangeRateWON && exchangeRateWON) {
    localStorage.setItem("exchangeRateWON", exchangeRateWON);
  }

  if (storedEUR !== exchangeRateEUR && exchangeRateEUR) {
    localStorage.setItem("exchangeRateEUR", exchangeRateEUR);
  }
}

async function setExchangeRate() {
  const exchangeRateDate = localStorage.getItem("exchangeRateDate");

  if (!exchangeRateDate || isExpiredExchangeRate(new Date(exchangeRateDate))) {
    const exchangeResponse = await fetch("https://swdev-hardy.com/api/auto-store/v1/exchange");
    const exchangeData = await exchangeResponse.json();
    const eurToMDL = 1 / exchangeData.EUR;

    localStorage.setItem("exchangeRateDate", new Date().toISOString());
    localStorage.setItem("exchangeRateWON", exchangeData.KRW.toFixed(4) || 83);
    localStorage.setItem("exchangeRateEUR", eurToMDL.toFixed(4) || 19);
  }

  const exchangeRateWON = localStorage.getItem("exchangeRateWON");

  return exchangeRateWON;
}

async function setImportTax() {
  const response = await fetch(
    "http://localhost:3000/v1/taxing/import-tax"
    // "https://swdev-hardy.com/api/auto-store/v1/taxing/import-tax"
  );
  const data = await response.json();

  localStorage.setItem("importTax", JSON.stringify(data));

  return data;
}

async function setASFees() {
  const response = await fetch("https://swdev-hardy.com/api/auto-store/v1/taxing");
  const data = await response.json();

  localStorage.setItem("asFees", JSON.stringify(data));

  return data;
}
