import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Popover, Button, Select, Calendar, Modal } from "antd";
import dateFormatterFromNewDate from "../../DateFormatterFromNewDate";
import dateFormatterToNewDate from "../../DateFormatterToNewDate";
import {
  startGetting,
  cleanFilter,
  setCurrentDate,
  setCurrentCompareDate,
} from "../../redux/actions";
import { Context } from "../../context";

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

  return (
    <>
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
