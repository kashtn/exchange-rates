import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Popover, Button, Select, Calendar, Modal } from "antd";
import dateFormatterFromNewDate from "../../DateFormatterFromNewDate";
import {
  startGetting,
  cleanFilter,
  setCompareRates,
} from "../../redux/actions";
import { Context } from "../../context";

const { Option } = Select;

export default function SearchForm(props) {
  const dispatch = useDispatch();

  const {
    setDynamicFlagFunc,
    setSelectedCharFunc,
    setVisibleFunc,
    setCompareFlagFunc,
    setSearchFlagFunc,
  } = useContext(Context);

  const reduxRates = useSelector((state) => state.rates);
  const currentDate = useSelector((state) => state.currentDate);

  const [selectedDate, setSelectedDate] = useState("");
  const [form] = Form.useForm();

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
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onSelect={onSearchChange} />
    </div>
  );

  useEffect(() => {
    setSelectedDate('')
    console.log(123);
    console.log(props.flag,
      currentDate,
      selectedDate,
      currentDate !== selectedDate);
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
    setSearchFlagFunc(true);
    if (selectedDate) {
      let dateArr = selectedDate.split("/");
      let dateChange = [dateArr[1], dateArr[0], dateArr[2]];
      let dateResult = new Date(dateChange.join("."));
      if (dateResult < new Date()) {
        setDynamicFlagFunc(false);
        setSelectedCharFunc(values.charCode);
        dispatch(cleanFilter());
        setVisibleFunc(true);
        setCompareFlagFunc(false);
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

  function onSearchChange(value) {
    setSelectedDate(dateFormatterFromNewDate(value._d));
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
          <Popover content={contentCalendar} trigger="click">
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
