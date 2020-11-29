import { useMemo, useCallback, useEffect, useState } from "react";
import { Chart } from "react-charts";
import { useSelector } from "react-redux";

import CanvasJSReact from "../../canvasjs.react";
//var CanvasJSReact = require('./canvasjs.react');
let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Graph() {
  const dynamicData = useSelector((state) => state.dynamicValues);
  const [points, setPoints] = useState([]);
  console.log(points);

  useEffect(() => {
    async function points() {
      const response = await fetch(
        "https://canvasjs.com/data/gallery/react/nifty-stock-price.json"
      );
      const result = await response.json();
      let arr = result.map((point) => {
        return {
          x: new Date(point.x),
          y: point.y,
        };
      });
      setPoints(arr);
    }
    points();
  }, []);

  const options = {
    theme: "light2",
    title: {
      text: "Stock Price of NIFTY 50",
    },
    axisY: {
      title: "Price in USD",
      prefix: "$",
    },
    data: [
      {
        type: "line",
        xValueFormatString: "DD MM YYYY",
        yValueFormatString: "$#,##0.00",
        dataPoints: dynamicData,
      },
    ],
  };
  return (
    <>
      {points.length > 0 ? (
        <div>
          <CanvasJSChart options={options} />
        </div>
      ) : (
        <h3>Okay good</h3>
      )}
    </>
  );
}

// function Graph() {
//   const dynamicData = useSelector((state) => state.dynamicValues);
//   console.log(dynamicData && dynamicData.length);
//   let numbers = dynamicData && dynamicData.map((day) => {
//     // console.log(day);
//     let numX = Number(day.x.split(',').join('.'))
//     let numY = Number(day.y.split('.').join(''))
//     return{
//       x: numX,
//       y: numY
//     }
//   })
//   console.log(numbers);

//   const data = useMemo(
//     () => [
//       {
//         label: "Series 1",
//         data:
//           dynamicData.length > 0
//             ? dynamicData
//             : [
//                 { x: 1, y: 10 },
//                 { x: 2, y: 15 },
//                 { x: 3, y: 7 },
//               ],
//       },
//     ],
//     []
//   );

//   const axes = useMemo(
//     () => [
//       { primary: true, type: "linear", position: "bottom" },
//       { type: "linear", position: "left" },
//     ],
//     []
//   );

//   return (
//     <div
//       style={{
//         width: "400px",
//         height: "300px",
//       }}
//     >
//       <Chart data={data} axes={axes} />
//     </div>
//   );
// }

export default Graph;
