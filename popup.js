let currentCarData = null;

window.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("#loader");
  const popupHeader = document.querySelector("#popup-header");

  if (popupHeader) {
    popupHeader.addEventListener("click", togglePopupEnabled);
  }

  if (!chrome || !chrome.storage) {
    console.error("Chrome storage API not available");
    return;
  }

  chrome.storage.local.get(["popupEnabled"], (result) => {
    const isEnabled = result.popupEnabled !== false;

    if (!isEnabled) {
      document.body.style.filter = "grayscale(100%)";
      loader.style.display = "none";
      return;
    }

    loader.style.display = "block";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getCarData" }, (carData) => {
        if (carData) {
          currentCarData = carData;
          displayCarData(carData);
        }
        loader.style.display = "none";
      });
    });
  });

  document.getElementById("calculateBtn").addEventListener("click", () => {
    chrome.storage.local.get(["popupEnabled"], (result) => {
      const isEnabled = result.popupEnabled !== false;
      if (isEnabled && currentCarData) {
        displayCarData(currentCarData);
      }
    });
  });

  document.getElementById("insuranceCheckbox").addEventListener("change", () => {
    chrome.storage.local.get(["popupEnabled"], (result) => {
      const isEnabled = result.popupEnabled !== false;
      if (isEnabled && currentCarData) {
        displayCarData(currentCarData);
      }
    });
  });

  document.getElementById("shippmentSelect").addEventListener("change", () => {
    chrome.storage.local.get(["popupEnabled"], (result) => {
      const isEnabled = result.popupEnabled !== false;
      if (isEnabled && currentCarData) {
        displayCarData(currentCarData);
      }
    });
  });

  document.getElementById("currencySelect").addEventListener("change", () => {
    chrome.storage.local.get(["popupEnabled"], (result) => {
      const isEnabled = result.popupEnabled !== false;
      if (isEnabled && currentCarData) {
        displayCarData(currentCarData);
      }
    });
  });
});

function displayCarData(data) {
  const { exchangeRates, calculation } = data;

  const KRWInput = document.querySelector("#KRWInput");
  const EURInput = document.querySelector("#EURInput");
  const MDLInput = document.querySelector("#MDLInput");
  const insuranceCheckbox = document.querySelector("#insuranceCheckbox");
  const shippingSelect = document.querySelector("#shippmentSelect");
  const currencySelect = document.querySelector("#currencySelect");

  KRWInput.value = exchangeRates?.usdToKrw || "N/A";
  EURInput.value = exchangeRates?.usdToEur || "N/A";
  MDLInput.value = exchangeRates?.usdToMdl || "N/A";

  const mdlExchangeRate = parseFloat(MDLInput.value) || 1;
  const eurExchangeRate = parseFloat(EURInput.value) || 1;
  const selectedCurrency = currencySelect.value;
  const includeInsurance = insuranceCheckbox.checked;
  const isFastShipping = shippingSelect.value === "fast";

  let shipmentTax = calculation.shipmentTaxUSD;
  if (isFastShipping) {
    shipmentTax += 600;
  }

  const insuranceAmount = includeInsurance ? calculation.priceUSD * 0.015 : 0;

  const adjustedCalculation = {
    ...calculation,
    shipmentTaxUSD: shipmentTax,
    insurance: insuranceAmount,
    totalWithInsurance: calculation.totalUSD - calculation.shipmentTaxUSD + shipmentTax + insuranceAmount,
  };

  generatePriceBreakdownTable(adjustedCalculation, mdlExchangeRate, eurExchangeRate, selectedCurrency);
  setTotalPrice(adjustedCalculation.totalWithInsurance, mdlExchangeRate, eurExchangeRate, selectedCurrency);
}

function generatePriceBreakdownTable(calculation, mdlExchangeRate, eurExchangeRate, currency) {
  const table = document.querySelector("#priceBreakdown");

  if (!calculation) {
    table.innerHTML = "<tr><td>Error loading car data</td></tr>";
    return;
  }

  const formatPrice = (usdPrice) => {
    const roundedPrice = Math.ceil(usdPrice / 10) * 10;

    if (currency === "MDL") {
      const mdlPrice = roundedPrice * mdlExchangeRate;

      return `L${mdlPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    } else if (currency === "EUR") {
      const eurPrice = roundedPrice * eurExchangeRate;

      return `€${eurPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    }

    return `$${roundedPrice.toLocaleString("en-US")}`;
  };

  table.innerHTML = `
    <tr class="darker">
      <th>Preț achiziționare</th>
      <td colspan="2" class="accent">${formatPrice(calculation.priceUSD)}</td>
    </tr>

    <tr class="lighter">
      <th rowspan="4">
        <b class="centered-bold">Cost devamare</b>
        <b class="centered-bold accent">
          ${formatPrice(calculation.shipmentTaxUSD + calculation.importTaxUSD + calculation.luxuryTaxUSD)}
        </b>
      </th>
    </tr>
    <tr class="lighter">
      <td>Cost livrare</td>
      <td colspan="2">${formatPrice(calculation.shipmentTaxUSD)}</td>
    </tr>
    <tr class="darker">
      <td>Suma accizelor</td>
      <td colspan="2">${formatPrice(calculation.importTaxUSD)}</td>
    </tr>
    <tr class="lighter">
      <td>Cota de acciz lux</td>
      <td colspan="2">${formatPrice(calculation.luxuryTaxUSD)}</td>
    </tr>

    <tr class="darker">
      <th rowspan="3" style="border-radius: 0 0 0 6px;">
        <b class="centered-bold">Alte taxe</b>
        <b class="centered-bold accent">
          ${formatPrice(calculation.processingFeeUSD + calculation.insurance)}
        </b>
      </th>
    </tr>
    <tr class="darker">
      <td>Taxa pentru proceduri vamale</td>
      <td>${formatPrice(calculation.processingFeeUSD)}</td>
    </tr>
    <tr class="lighter">
      <td>Asiguare</td>
      <td>${formatPrice(calculation.insurance)}</td>
    </tr>
  `;
}

function setTotalPrice(price, mdlExchangeRate, eurExchangeRate, currency) {
  const totalPrice = document.querySelector("#totalPrice");

  if (!price) {
    totalPrice.innerText = "N/A";
    return;
  }

  const roundedPrice = Math.ceil(price / 10) * 10;

  if (currency === "MDL") {
    const mdlPrice = roundedPrice * mdlExchangeRate;

    totalPrice.innerText = `L${mdlPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  else if (currency === "EUR") {
    const eurPrice = roundedPrice * eurExchangeRate;

    totalPrice.innerText = `€${eurPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  else {
    totalPrice.innerText = `$${roundedPrice.toLocaleString("en-US")}`;
  }
}

function togglePopupEnabled() {
  chrome.storage.local.get(["popupEnabled"], (result) => {
    const isEnabled = result.popupEnabled !== false;
    const newState = !isEnabled;

    chrome.storage.local.set({ popupEnabled: newState });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setEnabled", enabled: newState });
    });

    if (newState) {
      document.body.style.filter = "grayscale(0%)";
      if (currentCarData) {
        displayCarData(currentCarData);
      } else {
        const loader = document.querySelector("#loader");
        loader.style.display = "block";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getCarData" }, (carData) => {
            if (carData) {
              currentCarData = carData;
              displayCarData(carData);
            }
            loader.style.display = "none";
          });
        });
      }
    } else {
      document.body.style.filter = "grayscale(100%)";
    }
  });
}
