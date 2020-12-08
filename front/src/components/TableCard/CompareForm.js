import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Popover,
  Button,
  Select,
  Calendar,
  Modal,
  Radio,
  Col,
  Row,
} from "antd";
import dateFormatterFromNewDate from "../../DateFormatterFromNewDate";
import dateFormatterToNewDate from "../../DateFormatterToNewDate";
import {
  startGetting,
  cleanFilter,
  setCurrentDate,
  setCurrentCompareDate,
} from "../../redux/actions";
import { Context } from "../../context";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function CompareForm(props) {
  const dispatch = useDispatch();

  const {
    setDynamicFlagFunc,
    setSelectedCharFunc,
    setSelectedCompareCharFunc,
    setVisibleFunc,
    setCompareFlagFunc,
    setSearchFlagFunc,
  } = useContext(Context);

  const reduxRates = useSelector((state) => state.rates);
  const currentDate = useSelector((state) => state.currentDate);
  const currentCompareDate = useSelector((state) => state.currentCompareDate);

  const [selectedCompareDate1, setSelectedCompareDate1] = useState("");
  const [selectedCompareDate2, setSelectedCompareDate2] = useState("");
  const [calendarVisible1, setCalendarVisible1] = useState(false);
  const [calendarVisible2, setCalendarVisible2] = useState(false);

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
  let todayYear = new Date().getFullYear();
  const contentCompareCalendar1 = (
    <>
      <div className="site-calendar-demo-card">
        <Calendar
          fullscreen={false}
          headerRender={({ value, type, onChange, onTypeChange }) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current.month(i);
              months.push(localeData.monthsShort(current));
            }

            for (let index = start; index < end; index++) {
              monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                  {months[index]}
                </Select.Option>
              );
            }
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = 1994; i <= todayYear; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }
            return (
              <div style={{ padding: 8 }}>
                <Row gutter={8}>
                  <Col>
                    <Radio.Group
                      size="small"
                      onChange={(e) => onTypeChange(e.target.value)}
                      value={type}
                    >
                      <Radio.Button value="month">Month</Radio.Button>
                      <Radio.Button value="year">Year</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                      value={String(year)}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={String(month)}
                      onChange={(selectedMonth) => {
                        const newValue = value.clone();
                        newValue.month(parseInt(selectedMonth, 10));
                        onChange(newValue);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
          onChange={onCompareChange1}
        />
      </div>
      <Button className="chooseDateBtn" onClick={hideCalendar1}>
        Выбрать
      </Button>
    </>
  );
  const contentCompareCalendar2 = (
    <>
      <div className="site-calendar-demo-card">
        <Calendar
          fullscreen={false}
          headerRender={({ value, type, onChange, onTypeChange }) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current.month(i);
              months.push(localeData.monthsShort(current));
            }

            for (let index = start; index < end; index++) {
              monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                  {months[index]}
                </Select.Option>
              );
            }
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = 1994; i <= todayYear; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }
            return (
              <div style={{ padding: 8 }}>
                <Row gutter={8}>
                  <Col>
                    <Radio.Group
                      size="small"
                      onChange={(e) => onTypeChange(e.target.value)}
                      value={type}
                    >
                      <Radio.Button value="month">Month</Radio.Button>
                      <Radio.Button value="year">Year</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                      value={String(year)}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={String(month)}
                      onChange={(selectedMonth) => {
                        const newValue = value.clone();
                        newValue.month(parseInt(selectedMonth, 10));
                        onChange(newValue);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
          onChange={onCompareChange2}
        />
      </div>
      <Button className="chooseDateBtn" onClick={hideCalendar2}>
        Выбрать
      </Button>
    </>
  );
  const [modalError, setmodalError] = useState(false);

  useEffect(() => {
    if (props.flag) {
      setSelectedCompareDate1("");
      setSelectedCompareDate2("");
    }
    if (
      !props.flag &&
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

  function onCompareChange1(value) {
    setSelectedCompareDate1(dateFormatterFromNewDate(value._d));
  }
  function onCompareChange2(value) {
    setSelectedCompareDate2(dateFormatterFromNewDate(value._d));
  }

  async function compare(values) {
    setSearchFlagFunc(false);
    setDynamicFlagFunc(false);
    setSelectedCharFunc("");
    dispatch(cleanFilter());
    setSelectedCompareCharFunc(values.compareCharCode);
    if (selectedCompareDate1 && selectedCompareDate2) {
      if (
        dateFormatterToNewDate(selectedCompareDate1) <
        dateFormatterToNewDate(selectedCompareDate2)
      ) {
        dispatch(setCurrentDate(""));
        dispatch(setCurrentCompareDate(""));
        setVisibleFunc(false);
        dispatch(startGetting(selectedCompareDate1, selectedCompareDate2));
        setCompareFlagFunc(true);
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

  function hideCalendar1() {
    setCalendarVisible1(false);
  }
  function handleVisibleChange1(calendarVisible1) {
    setCalendarVisible1({ calendarVisible1 });
  }

  function hideCalendar2() {
    setCalendarVisible2(false);
  }
  function handleVisibleChange2(calendarVisible2) {
    setCalendarVisible2({ calendarVisible2 });
  }

  return (
    <>
      <div className="form">
        <h3>Сравнить</h3>
        <Form {...layout} onFinish={compare}>
          <Popover
            title={
              <div className="close">
                <a href className="closeBtn" onClick={hideCalendar1}>
                  <CloseOutlined color="grey" className="closeIcn" />
                </a>
              </div>
            }
            content={contentCompareCalendar1}
            trigger="click"
            visible={calendarVisible1}
            onVisibleChange={handleVisibleChange1}
          >
            <Button>Выбрать дату</Button>
          </Popover>
          <Form.Item label="Дата 1">
            <p className="selectedDate">
              {selectedCompareDate1
                ? selectedCompareDate1
                : "(Дата не выбрана)"}
            </p>
          </Form.Item>
          <Popover
            title={
              <div className="close">
                <a href className="closeBtn" onClick={hideCalendar2}>
                  <CloseOutlined color="grey" className="closeIcn" />
                </a>
              </div>
            }
            content={contentCompareCalendar2}
            trigger="click"
            visible={calendarVisible2}
            onVisibleChange={handleVisibleChange2}
          >
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
            <Select className="select" style={{ width: 120 }} title="Валюта">
              <Option value="">Все</Option>
              {reduxRates &&
                reduxRates.map((rate) => (
                  <Option key={rate.CharCode} value={rate["@attributes"].ID}>
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
    </>
  );
}
