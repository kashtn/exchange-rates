import { useSelector } from "react-redux";

import CanvasJSReact from "../../canvasjs.react";
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Graph(charCode) {
  const dynamicData = useSelector((state) => state.dynamicValues);

  const options = {
    theme: "light2",
    title: {
      text: `Динамика изменения ${charCode.charCode}`,
    },
    axisY: {
      prefix: "₽",
    },
    data: [
      {
        type: "line",
        xValueFormatString: "DD MMM YYYY",
        yValueFormatString: "$#,##0.00",
        dataPoints: dynamicData,
      },
    ],
  };
  return (
    <>
      <div>
        <CanvasJSChart options={options} />
      </div>
    </>
  );
}

export default Graph;
