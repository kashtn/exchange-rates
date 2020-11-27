import "./Table.css";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Table, Button, Form, Input, Modal, Popover } from "antd";
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
} from "../../redux/actions";

const { Search } = Input;

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

  useEffect(() => {
    if (filter === "toLowest") {
      dispatch(filterToLowest());
    } else if (filter === "toHighest") {
      dispatch(filterToHighest());
    }
  }, [dispatch, filter]);

  useEffect(() => {
    dispatch(startGetting(""));
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

  const columns = [
    {
      title: "Валюта",
      dataIndex: "CharCode",
    },
    {
      title: "Курс",
      dataIndex: "Value",
    },
  ];

  function onSearch(value) {
    dispatch(cleanFilter());
    if (value.match(checker)) {
      setVisible(true);
      setCompareFlag(false);
      dispatch(startGetting("?date_req=" + value));
      dispatch(setCurrentDate(value));
      dispatch(setCompareRates(""));
    } else {
      Modal.error({
        title: "Некорректный ввод даты!",
      });
    }
  }

  async function compare(values) {
    dispatch(cleanFilter());
    if (
      values.date1 &&
      values.date2 &&
      values.date1.match(checker) &&
      values.date2.match(checker)
    ) {
      setVisible(false);
      dispatch(
        startGetting("?date_req=" + values.date1, "?date_req=" + values.date2)
      );
      setCompareFlag(true);
    } else {
      Modal.error({
        title: "Некорректный ввод дат!",
      });
    }
  }

  async function saveRates() {
    if (reduxCompareRates) {
      console.log("both");
      const data = {
        date1: reduxRates,
        date2: reduxCompareRates,
      };
      const response = await fetch("/saveRates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result) {
        Modal.success({
          title: "Отчет сохранен!",
        });
      }
    } else {
      console.log("one");
      const response = await fetch("/saveRates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reduxRates),
      });
      const result = await response.json();
      if (result) {
        Modal.success({
          title: "Отчет сохранен!",
        });
      }
    }
  }

  return (
    <>
      <div className="main">
        <div>
          <h1>Курс Валют</h1>
          <Button
            type="primary"
            onClick={() => {
              dispatch(startGetting(""));
              dispatch(cleanFilter());
              dispatch(setCompareRates(""));
              setVisible(true);
            }}
          >
            Показать на сегодня
          </Button>
        </div>
        <div name="dateForm" className="dateForm">
          <h3>Найти</h3>
          <Search
            className="searchInput"
            placeholder="dd/mm/yyyy"
            onSearch={onSearch}
            enterButton
            maxLength="10"
          />
          <h3>Сравнить</h3>
          <Form form={form} onFinish={compare}>
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
            <Button htmlType="submit">Сравнить</Button>
          </Form>
          {loading && <div className="loader"></div>}
        </div>
        {visible && (
          <>
            <Popover content={content}>
              <Button type="link">Фильтровать</Button>
            </Popover>
            <div className="table">
              <h4>{currentDate}</h4>
              <Table columns={columns} dataSource={reduxRates && reduxRates} />
            </div>
          </>
        )}
        {compareFlag && (
          <>
            <Popover content={content}>
              <Button type="link">Фильтровать</Button>
            </Popover>
            <div className="compareTable">
              <div></div>
              <div className="table">
                <h4>{currentDate}</h4>
                <Table
                  columns={columns}
                  dataSource={reduxRates && reduxRates}
                />
              </div>
              <div></div>
              <div className="table">
                <h4>{currentCompareDate}</h4>
                <Table
                  columns={columns}
                  dataSource={reduxCompareRates && reduxCompareRates}
                />
              </div>
            </div>
          </>
        )}
        {(visible || compareFlag) && (
          <Button type="primary" onClick={saveRates}>
            Сохранить отчет
          </Button>
        )}
      </div>
    </>
  );
}

export default TableCard;
