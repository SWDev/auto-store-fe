let globalExchangeRateMDLtoEUR = 19;

window.addEventListener("DOMContentLoaded", async () => {
  const localStorageEUR = localStorage.getItem("exchangeRateEUR");
  const localStorageWON = localStorage.getItem("exchangeRateWON");

  if (!localStorageWON) {
    localStorage.setItem("exchangeRateWON", 83); // 83 won to 1 MDL
  }

  if (!localStorageEUR) {
    localStorage.setItem("exchangeRateEUR", 19); // 19 MDL to 1 eur;
  }

  document.getElementById("scrapeBtn").addEventListener("click", () => {
    const exchangeRateWONInput = document.getElementById(
      "exchangeRateWONInput"
    );
    const exchangeRateEURInput = document.getElementById(
      "exchangeRateEURInput"
    );

    let exchangeRateWONtoMDL = exchangeRateWONInput.value || localStorageWON;
    let exchangeRateMDLtoEUR = exchangeRateEURInput.value || localStorageEUR;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getPrice", exchangeRateWONtoMDL, exchangeRateMDLtoEUR },
        (response) => {
          exchangeRateWONInput.value = exchangeRateWONtoMDL;
          exchangeRateEURInput.value = exchangeRateMDLtoEUR;

          localStorage.setItem("exchangeRateWON", exchangeRateWONtoMDL);
          localStorage.setItem("exchangeRateEUR", exchangeRateMDLtoEUR);

          generatePriceBreakdownTable(response);
          setFinalPrice(response?.finalPrice);
        }
      );
    });
  });
});

function generatePriceBreakdownTable(response) {
  const table = document.querySelector(".price-breakdown table");

  console.log("response", response);

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
