import { useContext } from "react";
import { Popover, Button, Table, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getDynamic } from "../../redux/actions";
import { Context } from "../../context";

export default function TableComponent(props) {
  const dispatch = useDispatch();
  const { setDynamicFlagFunc, setCurrentCharCodeFunc } = useContext(Context);

  const reduxRates = useSelector((state) => state.rates);
  const currentDate = useSelector((state) => state.currentDate);
  const currentCompareDate = useSelector((state) => state.currentCompareDate);

  const dynamicContent = (
    <div>
      <p>Показать динамику</p>
    </div>
  );

  const columns = [
    {
      title: "Валюта",
      dataIndex: "CharCode",
      render: (text) => (
        <Popover content={dynamicContent}>
          <Button
            type="link"
            onClick={(e) => {
              findDynamic(e);
            }}
          >
            {text}
          </Button>
        </Popover>
      ),
    },
    {
      title: "Курс",
      dataIndex: "Value",
    },
  ];

  function findDynamic(e) {
    if (!props.visibleFlag) {
      setCurrentCharCodeFunc(e.target.innerText);
      const currencyName = e.target.innerText;
      try {
        const currencyId = reduxRates.find(
          (currency) => currency.CharCode === currencyName
        );
        const id = Object.values(currencyId["@attributes"])[0];
        dispatch(getDynamic(id, currentDate, currentCompareDate, currencyName));
        setDynamicFlagFunc(true);
      } catch (err) {
        Modal.error({
          title: "Невозможно показать динамику данной валюты!",
        });
      }
    } else {
      Modal.error({
        title: "Не задан период!",
      });
    }
  }

  return (
    <>
      <div className="table">
        <h4>{props.date}</h4>
        <Table columns={columns} dataSource={props.dataSource} />
      </div>
    </>
  );
}
