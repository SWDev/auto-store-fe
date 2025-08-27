window.addEventListener("DOMContentLoaded", async () => {
  const loader = document.querySelector("#loader");
  const KRWInput = document.querySelector("#KRWInput");
  const EURInput = document.querySelector("#EURInput");

  const { exchangeRateEUR, exchangeRateWON } = await setExchangeRate({
    loader,
    KRWInput,
    EURInput,
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "popupOpened", exchangeRateWON, exchangeRateEUR }, (response) => {
      loader.style.display = "block";

      updateExchangeRatesDisplay(response);
    });
  });

  document.getElementById("calculateBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const exchangeRateWON = KRWInput.value;
      const exchangeRateEUR = EURInput.value;

      localStorage.setItem("exchangeRateWON", exchangeRateWON);
      localStorage.setItem("exchangeRateEUR", exchangeRateEUR);

      chrome.tabs.sendMessage(tabs[0].id, { action: "getPrice", exchangeRateWON, exchangeRateEUR }, (response) => {
        updateExchangeRatesDisplay(response);
      });
    });
  });
});

function updateExchangeRatesDisplay(response) {
  generatePriceBreakdownTable(response);
  setTotalPrice(response?.totalPrice);
}

function generatePriceBreakdownTable(response) {
  const loader = document.querySelector("#loader");
  const table = document.querySelector("#priceBreakdown");

  table.innerHTML = `
        <tr class="darker">
          <th>Preț cumpărare</th>
          <td colspan="2" class="accent">${getPriceInEur(response?.acquisitionPrice)}</td>
        </tr>

        <tr class="lighter">
          <th rowspan="4">
            <b class="centered-bold">Devamare</b>
            <b class="centered-bold accent">
              ${getPriceInEur(response?.importTaxes?.total)}
            </b>
          </th>
        </tr>
        <tr class="lighter">
          <td>Suma accizelor</td>
          <td colspan="2">${getPriceInEur(+response?.importTaxes?.engineTax)}</td>
        </tr>
        <tr class="darker">
          <td>Proceduri vamale</td>
          <td colspan="2">${getPriceInEur(+response?.importTaxes?.customsTax)}</td>
        </tr>
        <tr class="lighter">
          <td>Cota de acciz lux</td>
          <td colspan="2">${getPriceInEur(+response?.importTaxes?.luxuryTax)}</td>
        </tr>

        <tr class="darker">
          <th rowspan="4" style="border-radius: 0 0 0 6px;" >
            <b class="centered-bold">Comisioane</b>
            <b class="centered-bold accent">
              ${getPriceInEur(response?.ASFee?.total)}
            </b>
          </th>
        </tr>
        <tr class="darker">
          <td>Asigurare cargo</td>
          <td>${getPriceInMDL(response?.ASFee?.cargoInsurance)}</td>
        </tr>
        <tr class="lighter">
          <td>Green Mark</td>
          <td>${getPriceInMDL(response?.ASFee?.greenMark)}</td>
        </tr>
        <tr class="darker">
          <td>Comision SVG</td>
          <td>${getPriceInMDL(response?.ASFee?.SVGCommission)}</td>
        </tr>
    `;

  loader.style.display = "none";
}

function setTotalPrice(price) {
  const totalPrice = document.querySelector("#totalPrice");

  totalPrice.innerText = getPriceInEur(+price);
}

function getPriceInEur(price) {
  if (price === undefined || price === null || isNaN(price)) {
    return "🤷‍♀️";
  }

  const eur = price / localStorage.getItem("exchangeRateEUR");

  return `${eur.toLocaleString("de-DE", { maximumFractionDigits: 0 })}€`;
}

function getPriceInMDL(price) {
  if (price === undefined || price === null) {
    return "🤷‍♀️";
  }

  return `${price.toLocaleString("de-DE", { maximumFractionDigits: 0 })} MDL`;
}

async function setExchangeRate({ loader, KRWInput, EURInput }) {
  const exchangeRateDate = localStorage.getItem("exchangeRateDate");

  if (!exchangeRateDate || isExpiredExchangeRate(new Date(exchangeRateDate))) {
    loader.style.display = "block";

    const exchangeResponse = await fetch("https://swdev-hardy.com/api/auto-store/v1/exchange");
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

  return { exchangeRateWON, exchangeRateEUR };
}

function isExpiredExchangeRate(dateToCheck) {
  const today = new Date();
  const exchangeRateUpdateTime = new Date(today);

  exchangeRateUpdateTime.setDate(today.getDate());
  exchangeRateUpdateTime.setHours(0, 0, 0, 0);

  return dateToCheck.getTime() < exchangeRateUpdateTime.getTime();
}
