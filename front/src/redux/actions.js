import {
  START_LOADING,
  FINISH_LOADING,
  GET_RATES,
  GET_COMPARE_RATES,
  SET_CURRENT_DATE,
  SET_CURRENT_COMPARE_DATE,
  SET_FILTER,
  TO_HIGHEST,
  TO_LOWEST,
  CLEAN_FILTER,
  ALPHABET_FILTER,
  SET_DYNAMIC_VALUES,
  GET_CHARCODES,
} from "./actionTypes";

function xmlToJson(xml) {
  let obj = {};

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue;
  }
  let textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i);
      let nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

export function startGetting(date1, date2) {
  return async function (dispatch) {
    dispatch(startLoading());
    const url = `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${date1}`;
    const response = await fetch("http://localhost:8080/" + url);
    // const response = await fetch("https://cors-anywhere.herokuapp.com/" + url);
    dispatch(finishLoading());
    if (response.status !== 200) {
      const response = await fetch("/getCurrentDay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: date1 && JSON.stringify({ date1 }),
      });
      const result = await response.json();
      if (result) {
        const rates = result.Valute;
        dispatch(setRates(rates));
        const charCodes = rates.map((el) => {
          return el.CharCode;
        });
        dispatch(getCharCodes(charCodes));
        const currentDate = result["@attributes"].Date.split(".").join("/");
        setTimeout(async () => {
          dispatch(setCurrentDate(currentDate));
          dispatch(finishLoading());
        }, 500);
      } else {
        console.log("Нет котировок на заданный день!");
        dispatch(finishLoading());
      }
    } else {
      const result = await response.text();
      const XmlNode = new DOMParser().parseFromString(result, "text/xml");
      const rates = xmlToJson(XmlNode).ValCurs.Valute;
      dispatch(setRates(rates));
      const charCodes = rates.map((el) => {
        return {
          charCode: el.CharCode,
          id: el["@attributes"].ID,
        };
      });
      console.log(charCodes);
      dispatch(getCharCodes(charCodes));
      const currentDate = xmlToJson(XmlNode)
        .ValCurs["@attributes"].Date.split(".")
        .join("/");
      setTimeout(async () => {
        dispatch(setCurrentDate(currentDate));
        dispatch(finishLoading());
      }, 500);
    }
    if (date2 && date2.length > 0) {
      const url = `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${date2}`;
      const response = await fetch("http://localhost:8080/" + url);
      // const response = await fetch(
      //   "https://cors-anywhere.herokuapp.com/" + url
      // );
      if (response.status !== 200) {
        const response = await fetch("/getCurrentDay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: date2 && JSON.stringify({ date2 }),
        });
        const result = await response.json();
        if (result) {
          const rates = result.Valute;
          dispatch(setCompareRates(rates));
          const charCodes = rates.map((el) => {
            return el.CharCode;
          });
          // dispatch(getCharCodes(charCodes));
          const currentDate = result["@attributes"].Date.split(".").join("/");
          dispatch(setCurrentCompareDate(currentDate));
          dispatch(finishLoading());
        } else {
          console.log("Нет котировок на заданный день!");
          dispatch(finishLoading());
        }
      } else {
        const result = await response.text();
        const XmlNode = new DOMParser().parseFromString(result, "text/xml");
        const rates = xmlToJson(XmlNode).ValCurs.Valute;
        dispatch(setCompareRates(rates));
        const currentDate = xmlToJson(XmlNode)
          .ValCurs["@attributes"].Date.split(".")
          .join("/");
        dispatch(setCurrentCompareDate(currentDate));
      }
    }
  };
}

export function getDynamic(currencyId, date1, date2, charCode) {
  return async function (dispatch) {
    const url = `http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${date1}&date_req2=${date2}&VAL_NM_RQ=${currencyId}`;
    // const response = await fetch("https://cors-anywhere.herokuapp.com/" + url);
    const response = await fetch("http://localhost:8080/" + url);
    if (response.status !== 200) {
      const response = await fetch("/getCurrentDynamic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date1, date2, charCode }),
      });
      const result = await response.json();
      let final = result.map((record) => {
        return {
          x: new Date(record.x),
          y: record.y,
        };
      });
      dispatch(setDynamicValues(final));
    } else {
      const result = await response.text();
      const XmlNode = new DOMParser().parseFromString(result, "text/xml");
      const records = xmlToJson(XmlNode).ValCurs.Record;
      let allValues =
        records &&
        records.map((rate) => {
          let dateOfRate = Object.values(rate["@attributes"])[0];
          let correctDate = dateOfRate.split(".");
          [correctDate[0], correctDate[1]] = [correctDate[1], correctDate[0]];
          return {
            x: new Date(correctDate.join(".")),
            y: Number(rate.Value.split(",").join(".")),
          };
        });
      dispatch(setDynamicValues(allValues));
    }
  };
}

export function startLoading() {
  return {
    type: START_LOADING,
    payload: true,
  };
}

export function finishLoading() {
  return {
    type: FINISH_LOADING,
    payload: false,
  };
}

export function setRates(rates) {
  return {
    type: GET_RATES,
    payload: rates,
  };
}

export function setCurrentDate(date) {
  return {
    type: SET_CURRENT_DATE,
    payload: date,
  };
}

export function setCompareRates(rates) {
  return {
    type: GET_COMPARE_RATES,
    payload: rates,
  };
}

export function setCurrentCompareDate(date) {
  return {
    type: SET_CURRENT_COMPARE_DATE,
    payload: date,
  };
}

export function setFilter(type) {
  return {
    type: SET_FILTER,
    payload: type,
  };
}

export function filterToLowest(rates, compareRates) {
  let filteredRates = rates.sort((a, b) => {
    let firstRate = Number(a.Value.split(",").join("."));
    let secondRate = Number(b.Value.split(",").join("."));
    return secondRate - firstRate;
  });
  let filteredCompareRates =
    compareRates.length > 0
      ? compareRates.sort((a, b) => {
          let firstRate = Number(a.Value.split(",").join("."));
          let secondRate = Number(b.Value.split(",").join("."));
          return secondRate - firstRate;
        })
      : "";
  return {
    type: TO_LOWEST,
    payload: {
      rates: filteredRates,
      compareRates: filteredCompareRates,
    },
  };
}

export function filterToHighest(rates, compareRates) {
  let filteredRates = rates.sort((a, b) => {
    let firstRate = Number(a.Value.split(",").join("."));
    let secondRate = Number(b.Value.split(",").join("."));
    return firstRate - secondRate;
  });
  let filteredCompareRates =
    compareRates.length > 0
      ? compareRates.sort((a, b) => {
          let firstRate = Number(a.Value.split(",").join("."));
          let secondRate = Number(b.Value.split(",").join("."));
          return firstRate - secondRate;
        })
      : "";
  return {
    type: TO_HIGHEST,
    payload: {
      rates: filteredRates,
      compareRates: filteredCompareRates,
    },
  };
}

export function cleanFilter() {
  return {
    type: CLEAN_FILTER,
  };
}

export function alphabetFilter(rates, compareRates) {
  let filteredRates = rates.sort((a, b) => {
    if (a.CharCode < b.CharCode) {
      return -1;
    }
    if (a.CharCode > b.CharCode) {
      return 1;
    }
    return 0;
  });

  let filteredCompareRates = compareRates && compareRates.sort((a, b) => {
    if (a.CharCode < b.CharCode) {
      return -1;
    }
    if (a.CharCode > b.CharCode) {
      return 1;
    }
    return 0;
  });

  return {
    type: ALPHABET_FILTER,
    payload: {
      rates: filteredRates,
      compareRates: filteredCompareRates,
    },
  };
}

export function setDynamicValues(allValues) {
  return {
    type: SET_DYNAMIC_VALUES,
    payload: allValues,
  };
}

export function getCharCodes(charCodes) {
  return {
    type: GET_CHARCODES,
    payload: charCodes,
  };
}
