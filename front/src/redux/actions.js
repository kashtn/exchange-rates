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
  var obj = {};

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue;
  }
  var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

export function getBase(){
  let date = new Date().toJSON().slice(0,10).split('-')
  date = [date[2], date[1], date[0]]
  const today = date.join('/')
  console.log(today);
  return async () => {

  }
}

export function startGetting(date1, date2) {
  return async function (dispatch) {
    dispatch(startLoading());
    const url = `http://www.cbr.ru/scripts/XML_daily.asp${date1}`;
    const response = await fetch("http://localhost:8080/" + url);
    const result = await response.text();
    const XmlNode = new DOMParser().parseFromString(result, "text/xml");
    const rates = xmlToJson(XmlNode).ValCurs.Valute;
    dispatch(setRates(rates));
    const charCodes = rates.map((el) => {
      return el.CharCode;
    });
    dispatch(getCharCodes(charCodes));
    const currentDate = xmlToJson(XmlNode)
      .ValCurs["@attributes"].Date.split(".")
      .join("/");
    setTimeout(async () => {
      dispatch(setCurrentDate(currentDate));
      dispatch(finishLoading());
    }, 500);

    if (date2 && date2.length > 0) {
      const url = `http://www.cbr.ru/scripts/XML_daily.asp${date2}`;
      const response = await fetch("http://localhost:8080/" + url);
      const result = await response.text();
      const XmlNode = new DOMParser().parseFromString(result, "text/xml");
      const rates = xmlToJson(XmlNode).ValCurs.Valute;
      dispatch(setCompareRates(rates));
      const currentDate = xmlToJson(XmlNode)
        .ValCurs["@attributes"].Date.split(".")
        .join("/");
      dispatch(setCurrentCompareDate(currentDate));
    }
  };
}

export function getDynamic(currencyId, date1, date2) {
  return async function (dispatch) {
    const url = `http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${date1}&date_req2=${date2}&VAL_NM_RQ=${currencyId}`;
    const response = await fetch("http://localhost:8080/" + url);
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

export function filterToLowest() {
  return {
    type: TO_LOWEST,
  };
}

export function filterToHighest() {
  return {
    type: TO_HIGHEST,
  };
}

export function cleanFilter() {
  return {
    type: CLEAN_FILTER,
  };
}

export function alphabetFilter() {
  return {
    type: ALPHABET_FILTER,
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
