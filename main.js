const keys = [
  "year",
  "연식",
  "mileage",
  "displacement",
  "배기량",
  "fuel",
  "연료",
];
const tax = {
  diesel: {
    age: {
      0: {
        displacement: {
          0: 12.23,
          1500: 31.14,
          2500: 55.6,
        },
      },
      1: {
        displacement: {
          0: 12.23,
          1500: 31.14,
          2500: 55.6,
        },
      },
      2: {
        displacement: {
          0: 12.23,
          1500: 31.14,
          2500: 55.6,
        },
      },
      3: {
        displacement: {
          0: 12.67,
          1500: 31.58,
          2500: 56.04,
        },
      },
      4: {
        displacement: {
          0: 12.67,
          1500: 31.58,
          2500: 56.04,
        },
      },
      5: {
        displacement: {
          0: 12.9,
          1500: 31.81,
          2500: 56.27,
        },
      },
      6: {
        displacement: {
          0: 12.9,
          1500: 31.81,
          2500: 56.27,
        },
      },
      7: {
        displacement: {
          0: 14.19,
          1500: 34.99,
          2500: 61.9,
        },
      },
      8: {
        displacement: {
          0: 15.61,
          1500: 38.49,
          2500: 68.9,
        },
      },
      9: {
        displacement: {
          0: 17.17,
          1500: 42.34,
          2500: 74.9,
        },
      },
      10: {
        displacement: {
          0: 20.6,
          1500: 50.81,
          2500: 89.87,
        },
      },
      11: {
        displacement: {
          0: 26.79,
          1500: 66.05,
          2500: 116.84,
        },
      },
      12: {
        displacement: {
          0: 31.79,
          1500: 71.05,
          2500: 121.84,
        },
      },
      13: {
        displacement: {
          0: 36.79,
          1500: 76.05,
          2500: 126.84,
        },
      },
      14: {
        displacement: {
          0: 41.79,
          1500: 81.05,
          2500: 131.84,
        },
      },
      15: {
        displacement: {
          0: 46.79,
          1500: 86.05,
          2500: 136.84,
        },
      },
      16: {
        displacement: {
          0: 51.79,
          1500: 91.05,
          2500: 141.84,
        },
      },
      17: {
        displacement: {
          0: 56.79,
          1500: 96.05,
          2500: 146.84,
        },
      },
      18: {
        displacement: {
          0: 61.79,
          1500: 101.05,
          2500: 151.84,
        },
      },
      19: {
        displacement: {
          0: 66.79,
          1500: 106.05,
          2500: 156.84,
        },
      },
      20: {
        displacement: {
          0: 71.79,
          1500: 111.05,
          2500: 161.84,
        },
      },
    },
  },
  petrol: {
    0: {
      displacement: {
        0: 9.56,
        1000: 12.23,
        1500: 18.9,
        2000: 31.14,
        3000: 55.6,
      },
    },
    1: {
      displacement: {
        0: 9.56,
        1000: 12.23,
        1500: 18.9,
        2000: 31.14,
        3000: 55.6,
      },
    },

    2: {
      displacement: {
        0: 9.56,
        1000: 12.23,
        1500: 18.9,
        2000: 31.14,
        3000: 55.6,
      },
    },
    3: {
      displacement: {
        0: 10,
        1000: 12.67,
        1500: 19.34,
        2000: 31.68,
        3000: 56.04,
      },
    },
    4: {
      displacement: {
        0: 10,
        1000: 12.67,
        1500: 19.34,
        2000: 31.68,
        3000: 56.04,
      },
    },
    5: {
      displacement: {
        0: 10.23,
        1000: 12.9,
        1500: 19.57,
        2000: 31.81,
        3000: 56.27,
      },
    },
    6: {
      displacement: {
        0: 10.23,
        1000: 12.9,
        1500: 19.57,
        2000: 31.81,
        3000: 56.27,
      },
    },
    7: {
      displacement: {
        0: 11.25,
        1000: 14.19,
        1500: 21.53,
        2000: 34.99,
        3000: 61.9,
      },
    },
    8: {
      displacement: {
        0: 12.38,
        1000: 15.61,
        1500: 23.68,
        2000: 38.49,
        3000: 68.09,
      },
    },
    9: {
      displacement: {
        0: 13.62,
        1000: 17.17,
        1500: 26.05,
        2000: 42.34,
        3000: 74.9,
      },
    },
    10: {
      displacement: {
        0: 16.34,
        1000: 20.6,
        1500: 31.26,
        2000: 50.81,
        3000: 89.87,
      },
    },
    11: {
      displacement: {
        0: 21.24,
        1000: 26.79,
        1500: 40.63,
        2000: 66.05,
        3000: 116.84,
      },
    },
    12: {
      displacement: {
        0: 26.24,
        1000: 31.79,
        1500: 45.79,
        2000: 71.05,
        3000: 121.84,
      },
    },
    13: {
      displacement: {
        0: 31.24,
        1000: 36.79,
        1500: 50.63,
        2000: 76.05,
        3000: 126.84,
      },
    },
    14: {
      displacement: {
        0: 36.24,
        1000: 41.79,
        1500: 55.63,
        2000: 81.05,
        3000: 131.84,
      },
    },
    15: {
      displacement: {
        0: 41.24,
        1000: 46.79,
        1500: 60.63,
        2000: 86.05,
        3000: 136.84,
      },
    },
    16: {
      displacement: {
        0: 46.24,
        1000: 51.79,
        1500: 65.63,
        2000: 91.05,
        3000: 141.84,
      },
    },
    17: {
      displacement: {
        0: 51.24,
        1000: 56.79,
        1500: 70.63,
        2000: 96.05,
        3000: 146.84,
      },
    },
    18: {
      displacement: {
        0: 56.24,
        1000: 61.79,
        1500: 75.63,
        2000: 101.05,
        3000: 151.84,
      },
    },
    19: {
      displacement: {
        0: 61.24,
        1000: 66.79,
        1500: 80.63,
        2000: 106.05,
        3000: 156.84,
      },
    },
    20: {
      displacement: {
        0: 66.24,
        1000: 71.79,
        1500: 85.63,
        2000: 111.05,
        3000: 161.84,
      },
    },
  },
  pluginHybrid: 50,
  hybrid: 25,
  luxury: {
    600000: 2,
    700001: 3,
    800001: 4,
    900001: 5,
    1000001: 6,
    1200001: 7,
    1400001: 8,
    1600001: 9,
    1800001: 10,
  },
};

createStickyNote();
calculateOnLoad();

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "popupOpened") {
    const details = document.querySelector(".DetailSummary_btn_detail__msm-h");

    details.click();

    let timeElapsed = 0;
    const maxTime = 10000; // 10 seconds
    const intervalTime = 100; // 0.1 second

    const checkInterval = setInterval(() => {
      if (checkElement(".DetailSummary_btn_detail__msm-h", checkInterval)) {
        const calculated = getPriceInEur(request.exchangeRateWON);

        sendResponse(calculated);

        return;
      }

      timeElapsed += intervalTime;

      if (timeElapsed >= maxTime) {
        clearInterval(checkInterval);
      }
    }, intervalTime);

    return true;
  }

  if (request.action === "getPrice") {
    const calculated = getPriceInEur(request.exchangeRateWON);

    sendResponse(calculated);
  }
});

async function calculateOnLoad() {
  await setExchangeRate();

  const a = setInterval(() => {
    document.querySelector(".DetailSummary_btn_detail__msm-h")?.click();

    if (document.querySelector(".BottomSheet-module_close_btn__FNC9C")) {
      getPriceInEur(localStorage.getItem("exchangeRateWON"));
      clearInterval(a);
      document.querySelector(".BottomSheet-module_close_btn__FNC9C").click();
    }
  }, 200);

  setTimeout(() => {
    clearInterval(a);
  }, 20000);
}

function getPriceInEur(exchangeRateWON) {
  let wonPrice = document.querySelector(
    ".DetailLeadCase_point__vdG4b"
  ).innerText;

  if (wonPrice.includes(",")) {
    wonPrice = +wonPrice.replace(/,/g, "") / 100;
  }

  const purchasedPriceInMDL = (+wonPrice * 1_000_000) / exchangeRateWON;
  const params = Array.from(document.querySelectorAll("#bottom_sheet li"));

  return calculate({ params, purchasedPriceInMDL });
}

function calculate(options) {
  const { params, purchasedPriceInMDL } = options;
  const data = params
    .map((param) => param.innerText.toLowerCase().split("\n"))
    .filter(([param]) => keys.find((key) => param.toLowerCase().includes(key)));
  const { displacementTax, luxuryTax } = calculateTaxes(
    data,
    purchasedPriceInMDL
  );
  const response = {
    price: purchasedPriceInMDL.toFixed(),
    importTax: displacementTax.toFixed(),
    shippingFee: 60_000,
    luxuryTax,
    finalPrice: purchasedPriceInMDL + displacementTax + 60_000 + luxuryTax,
  };

  setPriceOnStickyNote(response.finalPrice);

  return response;
}

function findLowest(object, number) {
  if (!object) return 0;

  const keys = Object.keys(object);
  let lowest = keys[0];

  for (let i = 1; i < keys.length; i++) {
    if (keys[i] > number && keys[i] < lowest) {
      lowest = keys[i];
    }
  }

  return object[lowest];
}

function calculateTaxes(data, purchasedPriceInMDL) {
  const carAge = getAge(data);
  const fuel = getFuel(data);
  const displacement = getDisplacement(data);
  const yearTax = tax[fuel]?.age[carAge];
  const displacementTax =
    findLowest(yearTax?.displacement, displacement) * displacement;
  const luxuryTax =
    purchasedPriceInMDL >= 600_000
      ? findLowest(tax.luxury, purchasedPriceInMDL) * purchasedPriceInMDL
      : 0;

  return {
    displacementTax,
    luxuryTax,
  };
}

function getFuel(data) {
  const fuel = data.find(
    ([param]) => param.includes("fuel") || param.includes("연료")
  ) || ["", ""];

  return getFuelType(fuel[1]);
}

function getAge(data) {
  const year = data.find(
    ([param]) => param.includes("year") || param.includes("연식")
  ) || ["", ""];

  let yearValue = new Date().getFullYear();

  if (!year[1].includes("년")) {
    yearValue = year[1].replace(/\D/g, "");
  } else {
    yearValue = `20${year[1].slice(0, 2)}`;
  }

  return new Date().getFullYear() - yearValue;
}

function getDisplacement(data) {
  const displacement = data.find(
    ([param]) =>
      param.includes("displacement") ||
      param.includes("배기량") ||
      param.includes("engine")
  ) || ["", ""];

  return parseInt(displacement[1].replace(/\D/g, ""));
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

function checkElement(selector, intervalId) {
  const element = document.querySelector(selector);

  if (element) {
    clearInterval(intervalId);

    return true;
  }

  return false;
}

function createStickyNote() {
  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (!stickyNote) {
    const stickyNote = document.createElement("div");
    const logSrc =
      "https://swdev-hardy.com/ui/auto-store-fees/assets/favicon/favicon-32x32.png";

    stickyNote.id = "car-calculator-sticky-note";
    stickyNote.innerHTML = `<img style="width: 20px; height: 20px; object-fit: none;" src="${logSrc}"/><span>loading...</span>`;
    stickyNote.style.cssText = `
      position: fixed;
      top: 110px;
      left: 5px;
      background-color: white;
      border: 2px solid rgb(255, 80, 0);
      color: rgb(255, 80, 0);
      padding: 0 5px;
      font-size: 24px;
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
  }
}

function setPriceOnStickyNote(price) {
  console.log("Setting price on sticky note:", price);

  const stickyNote = document.getElementById("car-calculator-sticky-note");

  if (stickyNote) {
    const priceInEUR = (
      price / localStorage.getItem("exchangeRateEUR")
    ).toFixed();
    stickyNote.querySelector("span").innerText = priceInEUR + "€";
  }
}

async function setExchangeRate() {
  const exchangeRateDate = localStorage.getItem("exchangeRateDate");

  if (!exchangeRateDate || isExpiredExchangeRate(new Date(exchangeRateDate))) {
    const exchangeResponse = await fetch(
      "https://swdev-hardy.com/api/auto-store/v1/exchange"
    );
    const exchangeData = await exchangeResponse.json();
    const eurToMDL = 1 / exchangeData.EUR;

    localStorage.setItem("exchangeRateDate", new Date().toISOString());
    localStorage.setItem("exchangeRateWON", exchangeData.KRW.toFixed(4) || 83);
    localStorage.setItem("exchangeRateEUR", eurToMDL.toFixed(4) || 19);
  }

  const exchangeRateWON = localStorage.getItem("exchangeRateWON");
  const exchangeRateEUR = localStorage.getItem("exchangeRateEUR");

  return exchangeRateWON;
}

function isExpiredExchangeRate(dateToCheck) {
  const today = new Date();
  const exchangeRateUpdateTime = new Date(today);

  exchangeRateUpdateTime.setDate(today.getDate());
  exchangeRateUpdateTime.setHours(0, 0, 0, 0);

  return dateToCheck.getTime() < exchangeRateUpdateTime.getTime();
}
