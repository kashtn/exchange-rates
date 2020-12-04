import "./Table.css";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Table, Button, Form, Input, Modal, Popover, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  startGetting,
  setCurrentDate,
  setFilter,
  filterToHighest,
  filterToLowest,
  cleanFilter,
  alphabetFilter,
  setCompareRates,
  getDynamic,
} from "../../redux/actions";
import Graph from "../Graph/Graph";
import GetBase from "../GetBase/GetBase";

const { Option } = Select;

function TableCard() {
  const dispatch = useDispatch();
  const checker = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
  const [form] = Form.useForm();

  const reduxRates = useSelector((state) => state.rates);
  const reduxCompareRates = useSelector((state) => state.compareRates);
  const currentDate = useSelector((state) => state.currentDate);
  const currentCompareDate = useSelector((state) => state.currentCompareDate);
  const loading = useSelector((state) => state.loading);
  const filter = useSelector((state) => state.filter);

  const [visible, setVisible] = useState(false);
  const [compareFlag, setCompareFlag] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(false);
  const [currentCharCode, setCurrentCharCode] = useState("");
  const [selectedChar, setSelectedChar] = useState("");
  const [selectedCompareChar, setSelectedCompareChar] = useState("");

  let newArr = [];
  let current =
    selectedChar && selectedChar !== "Все" && reduxRates
      ? reduxRates.find((rate) => {
          if (rate["@attributes"].ID === selectedChar) {
            return rate;
          } else return "";
        })
      : reduxRates;
  newArr.push(current);

  let newArr2 = [];
  let newCurrent =
    selectedCompareChar && selectedCompareChar !== "Все" && reduxRates
      ? reduxRates.find((rate) => {
          if (rate["@attributes"].ID === selectedCompareChar) {
            return rate;
          } else return "";
        })
      : reduxRates;
  newArr2 = [newCurrent];

  let newCompareArr = [];
  let currentCompare =
    selectedCompareChar && selectedCompareChar !== "Все" && reduxCompareRates
      ? reduxCompareRates.find((rate) => {
          if (rate["@attributes"].ID === selectedCompareChar) {
            return rate;
          } else return "";
        })
      : reduxCompareRates;
  newCompareArr = [currentCompare];

  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 16,
    },
  };

  useEffect(() => {
    if (filter === "toLowest") {
      dispatch(filterToLowest());
    } else if (filter === "toHighest") {
      dispatch(filterToHighest());
    }
  }, [dispatch, filter]);

  useEffect(() => {
    dispatch(startGetting(""));
    setVisible(true);
  }, [dispatch]);

  const content = (
    <>
      <div>
        <Button
          type="link"
          className="filterBtn"
          onClick={() => {
            dispatch(setFilter("toLowest"));
          }}
        >
          Фильтр по убыванию
        </Button>
      </div>
      <div>
        <Button
          type="link"
          className="filterBtn"
          onClick={() => {
            dispatch(setFilter("toHighest"));
          }}
        >
          Фильтр по возрастанию
        </Button>
      </div>
      <div>
        <Button
          type="link"
          className="filterBtn"
          onClick={() => {
            dispatch(cleanFilter());
            dispatch(alphabetFilter());
          }}
        >
          Фильтр по алфавиту
        </Button>
      </div>
    </>
  );

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
    if (!visible) {
      setCurrentCharCode(e.target.innerText);
      const currencyName = e.target.innerText;
      try {
        const currencyId = reduxRates.find(
          (currency) => currency.CharCode === currencyName
        );
        const id = Object.values(currencyId["@attributes"])[0];
        dispatch(getDynamic(id, currentDate, currentCompareDate, currencyName));
        setDynamicFlag(true);
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

  const onReset = () => {
    form.resetFields();
    setVisible(false);
    setSelectedChar("");
  };

  function onSearch(values) {
    if (values.date) {
      setDynamicFlag(false);
      setSelectedChar(values.charCode);
      dispatch(cleanFilter());
      if (values.date.match(checker)) {
        setVisible(true);
        setCompareFlag(false);
        dispatch(startGetting(values.date));
        dispatch(setCurrentDate(values.date));
        dispatch(setCompareRates([]));
      } else {
        Modal.error({
          title: "Некорректный ввод!",
        });
      }
    } else {
      Modal.error({
        title: "Некорректный ввод!",
      });
    }
  }

  async function compare(values) {
    setDynamicFlag(false);
    setSelectedChar("");
    dispatch(cleanFilter());
    setSelectedCompareChar(values.compareCharCode);
    if (
      values.date1 &&
      values.date2 &&
      values.date1.match(checker) &&
      values.date2.match(checker)
    ) {
      setVisible(false);
      dispatch(startGetting(values.date1, values.date2));
      setCompareFlag(true);
    } else {
      Modal.error({
        title: "Некорректный ввод!",
      });
    }
  }

  function download(filename, text) {
    var element = document.createElement("a");
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
    if (selectedChar !== "Все" && reduxCompareRates.length === 0) {
      let data = {
        Date: currentDate,
        data: newArr,
      };
      download("rates.json", JSON.stringify(data));
    } else if (selectedChar === "Все") {
      let data = {
        Date: currentDate,
        data: reduxRates,
      };
      download("rates.json", JSON.stringify(data));
    }
    if (reduxCompareRates.length > 0 && !selectedCompareChar) {
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
    } else if (selectedCompareChar) {
      let data = {
        data_1: {
          Date: currentDate,
          data: newArr2,
        },
        data_2: {
          Date: currentCompareDate,
          data: newCompareArr,
        },
      };
      download("rates.json", JSON.stringify(data));
    }
  }

  return (
    <>
      <div className="main">
        <GetBase />
        <div>
          <h1>Курс Валют</h1>
          <Button
            type="primary"
            onClick={() => {
              dispatch(startGetting(""));
              dispatch(cleanFilter());
              dispatch(setCompareRates([]));
              setVisible(true);
              setDynamicFlag(false);
              setCompareFlag(false);
            }}
          >
            Показать на сегодня
          </Button>
        </div>
        <div name="dateForm" className="dateForm">
          <div className="form">
            <h3>Найти</h3>
            <Form
              {...layout}
              form={form}
              name="searchForm"
              onFinish={onSearch}
              initialValues={{
                charCode: "Все",
                compareCharCode: "Все",
              }}
            >
              <Form.Item name="date" label="Дата">
                <Input placeholder="dd/mm/yyyy" />
              </Form.Item>
              <Form.Item label="Валюта" name="charCode">
                <Select style={{ width: 120 }} title="Валюта">
                  <Option value="">Все</Option>
                  {reduxRates &&
                    reduxRates.map((rate) => (
                      <Option
                        key={rate.CharCode}
                        value={rate["@attributes"].ID}
                      >
                        {rate.CharCode}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button className="button" type="primary" htmlType="submit">
                  Найти
                </Button>
                <Button className="button" htmlType="button" onClick={onReset}>
                  Сбросить
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="form">
            <h3>Сравнить</h3>
            <Form {...layout} onFinish={compare}>
              <Form.Item name="date1" label="Дата 1">
                <Input
                  className="searchInput"
                  placeholder="dd/mm/yyyy"
                  maxLength="10"
                />
              </Form.Item>
              <Form.Item name="date2" label="Дата 2">
                <Input
                  className="searchInput"
                  placeholder="dd/mm/yyyy"
                  maxLength="10"
                />
              </Form.Item>
              <Form.Item label="Валюта" name="compareCharCode">
                <Select style={{ width: 120 }} title="Валюта">
                  <Option value="">Все</Option>
                  {reduxRates &&
                    reduxRates.map((rate) => (
                      <Option
                        key={rate.CharCode}
                        value={rate["@attributes"].ID}
                      >
                        {rate.CharCode}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button htmlType="submit">Сравнить</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {loading && <div className="loader"></div>}
        {!loading && selectedChar && (
          <div className="table">
            <h4>{currentDate}</h4>
            <Table
              columns={columns}
              dataSource={selectedChar !== "Все" ? newArr : reduxRates}
            />
          </div>
        )}
        {!loading && visible && !selectedChar && (
          <>
            <Popover content={content} trigger="click">
              <Button type="link">Фильтровать</Button>
            </Popover>
            <div className="table">
              <h4>{currentDate}</h4>
              <Table columns={columns} dataSource={reduxRates && reduxRates} />
            </div>
          </>
        )}
        {dynamicFlag && <Graph charCode={currentCharCode} />}
        {!loading && compareFlag && (
          <>
            <Popover content={content} trigger="click">
              <Button type="link">Фильтровать</Button>
            </Popover>
            <div className="compareTable">
              <div></div>
              <div className="table">
                <h4>{currentDate}</h4>
                <Table
                  columns={columns}
                  dataSource={selectedCompareChar ? newArr2 : reduxRates}
                />
              </div>
              <div className="table">
                <h4>{currentCompareDate}</h4>
                <Table
                  columns={columns}
                  dataSource={
                    selectedCompareChar ? newCompareArr : reduxCompareRates
                  }
                />
              </div>
            </div>
          </>
        )}
        {!loading && (visible || compareFlag) && (
          <Button type="primary" onClick={saveRates}>
            Сохранить отчет
          </Button>
        )}
      </div>
    </>
  );
}

export default TableCard;
