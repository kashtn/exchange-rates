import { Button } from "antd";
import { useSelector } from "react-redux";

export default function SaveButton(props) {
  const reduxRates = useSelector((state) => state.rates);
  const reduxCompareRates = useSelector((state) => state.compareRates);
  const currentDate = useSelector((state) => state.currentDate);
  const currentCompareDate = useSelector((state) => state.currentCompareDate);

  function download(filename, text) {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async function saveRates() {
    if (props.selectedChar !== "Все" && reduxCompareRates.length === 0) {
      let data = {
        Date: currentDate,
        data: props.newArr,
      };
      download("rates.json", JSON.stringify(data));
    } else if (props.selectedChar === "Все") {
      let data = {
        Date: currentDate,
        data: reduxRates,
      };
      download("rates.json", JSON.stringify(data));
    }
    if (reduxCompareRates.length > 0 && !props.selectedCompareChar) {
      let data = {
        data_1: {
          Date: currentDate,
          data: reduxRates,
        },
        data_2: {
          Date: currentCompareDate,
          data: reduxCompareRates,
        },
      };
      download("rates.json", JSON.stringify(data));
    } else if (props.selectedCompareChar) {
      let data = {
        data_1: {
          Date: currentDate,
          data: props.newArr2,
        },
        data_2: {
          Date: currentCompareDate,
          data: props.newCompareArr,
        },
      };
      download("rates.json", JSON.stringify(data));
    }
  }

  return (
    <>
      <Button type="primary" onClick={saveRates}>
        Сохранить отчет
      </Button>
    </>
  );
}
