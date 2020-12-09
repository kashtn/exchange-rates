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
import {
  startGetting,
  cleanFilter,
  setCompareRates,
} from "../../redux/actions";
import { Context } from "../../context";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SearchForm(props) {
  const dispatch = useDispatch();

  const { localDispatch } = useContext(Context);

  const {reduxRates, currentDate} = useSelector(state => state)

  const [selectedDate, setSelectedDate] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [form] = Form.useForm();

  const todayYear = new Date().getFullYear();

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
  const contentCalendar = (
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
          onSelect={onSearchChange}
        />
      </div>
      <Button className="chooseDateBtn" onClick={hideCalendar}>
        Выбрать
      </Button>
    </>
  );
  useEffect(() => {
    setSelectedDate("");
    if (
      props.flag &&
      currentDate &&
      selectedDate &&
      currentDate !== selectedDate
    ) {
      Modal.info({
        title: "Запрошеной даты нет в архиве, будет показана ближайшая.",
      });
    }
  }, [currentDate]);
  function onSearch(values) {
    localDispatch({
      type: "setSearchFlag",
      payload: true,
    });
    if (selectedDate) {
      let dateArr = selectedDate.split("/");
      let dateChange = [dateArr[1], dateArr[0], dateArr[2]];
      let dateResult = new Date(dateChange.join("."));
      if (dateResult < new Date()) {
        localDispatch({
          type: "setDynamicFlag",
          payload: false,
        });
        localDispatch({
          type: "setVisible",
          payload: true,
        });
        localDispatch({
          type: "setCompareFlag",
          payload: false,
        });
        localDispatch({
          type: "setSelectedChar",
          payload: values.charCode,
        });
        dispatch(cleanFilter());
        dispatch(startGetting(selectedDate));
        dispatch(setCompareRates([]));
      } else {
        Modal.error({
          title: "Неверная дата!",
        });
      }
    } else {
      Modal.error({
        title: "Не выбрана дата!",
      });
    }
  }
  function onSearchChange(value) {
    setSelectedDate(dateFormatterFromNewDate(value._d));
  }
  function hideCalendar() {
    setCalendarVisible(false);
  }
  function handleVisibleChange(calendarVisible) {
    setCalendarVisible({ calendarVisible });
  }
  return (
    <>
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
            title={
              <div className="close">
                <a href className="closeBtn" onClick={hideCalendar}>
                  <CloseOutlined color="grey" className="closeIcn" />
                </a>
              </div>
            }
            content={contentCalendar}
            trigger="click"
            visible={calendarVisible}
            onVisibleChange={handleVisibleChange}
          >
            <Button>Выбрать дату</Button>
          </Popover>
          <Form.Item label="Дата">
            <p className="selectedDate">
              {selectedDate ? selectedDate : "(Дата не выбрана)"}
            </p>
          </Form.Item>
          <Form.Item label="Валюта" name="charCode">
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
            <Button className="button" type="primary" htmlType="submit">
              Найти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
