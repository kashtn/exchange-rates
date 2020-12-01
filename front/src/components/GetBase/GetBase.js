import { useEffect } from "react";
import { Button } from "antd";

function GetBase() {
  useEffect(() => {
    getBaseRates();
  }, []);

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

  async function getDay(day, mounth, year) {
    const url = `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${day}/${mounth}/${year}`;
    const response = await fetch("http://localhost:8080/" + url);
    const result = await response.text();
    const XmlNode = new DOMParser().parseFromString(result, "text/xml");
    const rates = xmlToJson(XmlNode).ValCurs;
    return rates;
  }

  async function getBaseRates() {
    console.log("RUUUUUUN>>>>>");
    let day = 1;
    let month = 6;
    let monthForReq
    let year = "2020";
    if(month < 10){
      monthForReq = '0' + (month + 1)
      console.log(monthForReq);
    }else{
      monthForReq = String(month + 1) 
      console.log(monthForReq);
    }

    if(Number(month) < 13){
      async function request(dayTo, monthTo, yearTo) {
        let currentDayRates = await getDay(dayTo, monthTo, yearTo);
        console.log(dayTo);
        let response = await fetch("/setBase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDayRates),
        });
        let result;
        result = await response.json();
        console.log("From Server->", result);
        if (result === "ok") {
          let dayForReq;
          if (day < 30) {
            day += 1;
            if (String(day).length === 1) {
              console.log("more than zero");
              dayForReq = "0" + day;
              console.log(monthForReq);
              request(dayForReq, monthForReq, year);
            } else if (String(day).length === 2) {
              dayForReq = String(day);
              request(dayForReq, monthForReq, year);
            }
            console.log("0" + day);
            console.log(String(day).length);
          } else {
            monthForReq = '0' + (Number(monthForReq) + 1)
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',Number(monthForReq));
            if(Number(monthForReq) < 10){
              day = 1
              request("0" + day, monthForReq, year);
            }else if(Number(monthForReq) >= 10){
              monthForReq = String(Number(monthForReq))
              console.log(monthForReq);
              day = 1
              request("0" + day, monthForReq, year);
            } else if (Number(monthForReq) === 13){
              console.log('stop')
            }
          }
        }
      }
      request("0" + day, monthForReq, year);
    }
  }

  return (
    <>
      <Button onClick={getBaseRates}>Загрузить базу</Button>
    </>
  );
}

export default GetBase;
