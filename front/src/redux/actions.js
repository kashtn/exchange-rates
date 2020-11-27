import {
  START_LOADING,
  FINISH_LOADING,
  GET_RATES,
  GET_COMPARE_RATES,
  SET_CURRENT_DATE,
  SET_CURRENT_COMPARE_DATE,
} from "./actionTypes";

export function startGetting(date1, date2) {
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
  return async function (dispatch) {
    dispatch(startLoading());
    const url = `http://www.cbr.ru/scripts/XML_daily.asp${date1}`;
    let response = await fetch("http://localhost:8080/" + url);
    let result = await response.text();
    let XmlNode = new DOMParser().parseFromString(result, "text/xml");
    let rates = xmlToJson(XmlNode).ValCurs.Valute;
    dispatch(setRates(rates));
    let currentDate = xmlToJson(XmlNode)
      .ValCurs["@attributes"].Date.split(".")
      .join("/");
    dispatch(setCurrentDate(currentDate));
    dispatch(finishLoading());

    if (date2 && date2.length > 0) {
      const url = `http://www.cbr.ru/scripts/XML_daily.asp${date2}`;
      let response = await fetch("http://localhost:8080/" + url);
      let result = await response.text();
      let XmlNode = new DOMParser().parseFromString(result, "text/xml");
      let rates = xmlToJson(XmlNode).ValCurs.Valute;
      dispatch(setCompareRates(rates));
      let currentDate = xmlToJson(XmlNode)
        .ValCurs["@attributes"].Date.split(".")
        .join("/");
      dispatch(setCurrentCompareDate(currentDate));
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

export function filterRates(ratesFromFront){
  
}