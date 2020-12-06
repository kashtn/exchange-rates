import "./Table.css";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Popover, Select, Calendar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  startGetting,
  setCurrentDate,
  setCurrentCompareDate,
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
  const [form] = Form.useForm();

  const reduxRates = useSelector((state) => state.rates);
  const reduxCompareRates = useSelector((state) => state.compareRates);
  const currentDate = useSelector((state) => state.currentDate);
  const currentCompareDate = useSelector((state) => state.currentCompareDate);
  const loading = useSelector((state) => state.loading);
  const filter = useSelector((state) => state.filter);
  console.log("Rates", reduxRates);
  console.log("CompareRates", reduxCompareRates);

  const [visible, setVisible] = useState(false);
  const [compareFlag, setCompareFlag] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(false);
  const [currentCharCode, setCurrentCharCode] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCompareDate1, setSelectedCompareDate1] = useState("");
  const [selectedCompareDate2, setSelectedCompareDate2] = useState("");
  const [selectedChar, setSelectedChar] = useState("");
  const [selectedCompareChar, setSelectedCompareChar] = useState("");
  const [searchCalendar, setSearchCalendar] = useState(false);

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
      dispatch(filterToLowest(reduxRates, reduxCompareRates));
    } else if (filter === "toHighest") {
      dispatch(filterToHighest(reduxRates, reduxCompareRates));
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
          По убыванию
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
          По возрастанию
        </Button>
      </div>
      <div>
        <Button
          type="link"
          className="filterBtn"
          onClick={() => {
            dispatch(cleanFilter());
            dispatch(alphabetFilter(reduxRates, reduxCompareRates));
          }}
        >
          По алфавиту
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

  function dateFormatterToNewDate(date) {
    let dateArr = date.split("/");
    let dateChange = [dateArr[1], dateArr[0], dateArr[2]];
    let dateResult = new Date(dateChange);
    return dateResult;
  }

  function dateFormatterFromNewDate(date) {
    let chosenDate = date;
    let day = chosenDate.getDate();
    let month = chosenDate.getMonth() + 1;
    let year = chosenDate.getFullYear();
    day = day <= 9 ? "0" + day : day;
    month = month <= 9 ? "0" + month : month;
    let dateForSearch = day + "/" + month + "/" + year;
    return dateForSearch;
  }

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

  function onReset() {
    form.resetFields();
    setVisible(false);
    setSelectedChar("");
  }

  useEffect(() => {
    if (currentDate && selectedDate && currentDate !== selectedDate) {
      Modal.info({
        title: "Запрошеной даты нет в архиве, будет показана ближайшая.",
      });
    }
  }, [currentDate]);

  const [modalError, setmodalError] = useState(false);

  useEffect(() => {
    if (
      currentDate &&
      selectedCompareDate1 &&
      currentDate !== selectedCompareDate1
    ) {
      setmodalError(true);
      Modal.info({
        title:
          "*Дата 1* Запрошеной даты нет в архиве, будет показана ближайшая.",
      });
    } else if (currentDate === selectedCompareDate1) {
      setmodalError(false);
    }
  }, [currentDate]);

  useEffect(() => {
    if (
      currentCompareDate &&
      selectedCompareDate2 &&
      currentCompareDate !== selectedCompareDate2 &&
      !modalError
    ) {
      Modal.info({
        title:
          "*Дата 2* Запрошеной даты нет в архиве, будет показана ближайшая.",
      });
    }
  }, [currentCompareDate]);

  function onSearch(values) {
    // dispatch(setCurrentCompareDate(''))
    setSelectedCompareDate1("");
    setSelectedCompareDate2("");
    if (selectedDate) {
      let dateArr = selectedDate.split("/");
      let dateChange = [dateArr[1], dateArr[0], dateArr[2]];
      let dateResult = new Date(dateChange.join("."));
      if (dateResult < new Date()) {
        setDynamicFlag(false);
        setSelectedChar(values.charCode);
        dispatch(cleanFilter());
        setVisible(true);
        setCompareFlag(false);
        dispatch(startGetting(selectedDate));
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
    if (selectedCompareDate1 && selectedCompareDate2) {
      if (
        dateFormatterToNewDate(selectedCompareDate1) <
        dateFormatterToNewDate(selectedCompareDate2)
      ) {
        setSelectedDate("");
        dispatch(setCurrentDate(""));
        dispatch(setCurrentCompareDate(""));
        setVisible(false);
        dispatch(startGetting(selectedCompareDate1, selectedCompareDate2));
        setCompareFlag(true);
      } else {
        Modal.error({
          title: "Неправильно заданы даты!",
        });
      }
    } else {
      Modal.error({
        title: "Некорректный ввод!",
      });
    }
  }

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

  const contentCalendar = (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onSelect={onSearchChange} />
    </div>
  );
  const contentCompareCalendar1 = (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onChange={onCompareChange1} />
    </div>
  );
  const contentCompareCalendar2 = (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onChange={onCompareChange2} />
    </div>
  );

  function onSearchChange(value) {
    setSelectedDate(dateFormatterFromNewDate(value._d));
    // dispatch(setCurrentDate(dateFormatterFromNewDate(value._d)));
    // setSearchCalendar(false)
  }
  function onCompareChange1(value) {
    setSelectedCompareDate1(dateFormatterFromNewDate(value._d));
  }
  function onCompareChange2(value) {
    setSelectedCompareDate2(dateFormatterFromNewDate(value._d));
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
              <Popover
                // visible={searchCalendar}
                content={contentCalendar}
                trigger="click"
                // onVisibleChange={handleVisibleChange}
              >
                <Button
                // onClick={() => {setSearchCalendar(true)}}
                >
                  Выбрать дату
                </Button>
              </Popover>
              <Form.Item label="Дата">
                <p className="selectedDate">
                  {selectedDate ? selectedDate : "(Дата не выбрана)"}
                </p>
              </Form.Item>
              <Form.Item label="Валюта" name="charCode">
                <Select
                  className="select"
                  style={{ width: 120 }}
                  title="Валюта"
                >
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
              <Popover content={contentCompareCalendar1} trigger="click">
                <Button>Выбрать дату</Button>
              </Popover>
              <Form.Item label="Дата 1">
                <p className="selectedDate">
                  {selectedCompareDate1
                    ? selectedCompareDate1
                    : "(Дата не выбрана)"}
                </p>
              </Form.Item>
              <Popover content={contentCompareCalendar2} trigger="click">
                <Button>Выбрать дату</Button>
              </Popover>
              <Form.Item label="Дата 2">
                <p className="selectedDate">
                  {selectedCompareDate2
                    ? selectedCompareDate2
                    : "(Дата не выбрана)"}
                </p>
              </Form.Item>
              <Form.Item label="Валюта" name="compareCharCode">
                <Select
                  className="select"
                  style={{ width: 120 }}
                  title="Валюта"
                >
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
              <Button type="link">Сортировать</Button>
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
              <Button type="link">Сортировать</Button>
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
