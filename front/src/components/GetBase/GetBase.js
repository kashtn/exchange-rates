import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import "./GetBase.css";
import { useSelector } from "react-redux";

function GetBase() {
  const [checking, setChecking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [baseIsLoaded, setBaseIsLoaded] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const valutes = useSelector((state) => state.charCodes);

  useEffect(() => {
    // getBaseRates();
  }, []);

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

  async function getDay(day, mounth, year) {
    const url = `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${day}/${mounth}/${year}`;
    // const response = await fetch("https://cors-anywhere.herokuapp.com/" + url);
    let response;
    response = await fetch("http://localhost:8080/" + url);
    if (response.status !== 200) {
      setIsModalVisible(false);
      setConnectionError(true);
      Modal.error({
        title: "Нет соединения, пожалуйста проверьте подключение к интернету!",
      });
    } else {
      setConnectionError(false);
      const result = await response.text();
      const XmlNode = new DOMParser().parseFromString(result, "text/xml");
      const rates = xmlToJson(XmlNode).ValCurs;
      return rates;
    }
  }

  async function getBaseRates() {
    setChecking(true);
    setIsModalVisible(true);
    console.log("RUUUUUUNING>>>>>");
    let day = 1;
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let monthForDynamic;
    let yearForDynamic = year;
    let monthForReq;
    if (month >= 7) {
      monthForReq = "0" + (month - 6);
      monthForDynamic = monthForReq;
    } else {
      monthForReq = month + 12 - 6;
      monthForReq = monthForReq < 10 ? "0" + monthForReq : String(monthForReq);
      monthForDynamic = monthForReq;
      year = String(year - 1);
      yearForDynamic = year;
    }
    let firstDateForDynamic =
      "0" + day + "/" + monthForDynamic + "/" + yearForDynamic;
    let secondDateForDynamic = "0" + today.getDay() + "/" + month + "/" + year;

    if (month < 13) {
      async function dynamicRequest(
        firstDate,
        secondDate,
        currencyId,
        charCode
      ) {
        const url = `http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${firstDate}&date_req2=${secondDate}&VAL_NM_RQ=${currencyId}`;
        console.log("RUNNNNNNN>>>> DYNAMICCCCCCC>>>>");
        const response = await fetch("http://localhost:8080/" + url);
        if (response.status === 200) {
          setConnectionError(false);
          const result = await response.text();
          const XmlNode = new DOMParser().parseFromString(result, "text/xml");
          const records = xmlToJson(XmlNode).ValCurs.Record;
          await fetch("/setRecords", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ charCode, records }),
          });
        } else {
          setConnectionError(true);
        }
      }
      valutes.map((valute) => {
        if (!connectionError) {
          dynamicRequest(
            firstDateForDynamic,
            secondDateForDynamic,
            valute.id,
            valute.charCode
          );
        }
      });
      async function request(dayTo, monthTo, yearTo) {
        let currentDayRates = await getDay(dayTo, monthTo, yearTo);
        console.log(`DAY = ${dayTo}`);
        let response = await fetch("/setBase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDayRates),
        });
        let result;
        result = await response.json();
        if (result === "ok") {
          let dayForReq;
          if (day < 30) {
            day += 1;
            if (String(day).length === 1) {
              dayForReq = "0" + day;
              request(dayForReq, monthForReq, year);
            } else if (String(day).length === 2) {
              dayForReq = String(day);
              request(dayForReq, monthForReq, year);
            }
          } else {
            monthForReq = "0" + (Number(monthForReq) + 1);
            console.log(`MONTH = ${Number(monthForReq)}`);
            if (Number(monthForReq) < 10) {
              day = 1;
              request("0" + day, monthForReq, year);
            } else if (Number(monthForReq) >= 10 && Number(monthForReq) < 13) {
              monthForReq = String(Number(monthForReq));
              console.log(monthForReq);
              day = 1;
              request("0" + day, monthForReq, year);
            } else {
              setChecking(false);
              setBaseIsLoaded(true);
              console.log("Base is loaded!");
            }
          }
        }
      }
      request("0" + day, monthForReq, year);
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={getBaseRates}>
        {baseIsLoaded ? <p>Загрузить базу &#9989;</p> : "Загрузить базу"}
      </Button>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {checking && <h3>Пожалуйста подождите, идёт проверка базы...</h3>}
        {checking && <div className="loader"></div>}
        {!checking && isModalVisible && (
          <h3>&#9989; База загружена успешно!</h3>
        )}
      </Modal>
    </>
  );
}

export default GetBase;
