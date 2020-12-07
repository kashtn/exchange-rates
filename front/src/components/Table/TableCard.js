import "./Table.css";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  startGetting,
  filterToHighest,
  filterToLowest,
  cleanFilter,
  setCompareRates,
} from "../../redux/actions";
import Graph from "../Graph/Graph";
import GetBase from "../GetBase/GetBase";
import { Context } from "../../context";
import CompareForm from "./CompareForm";
import SearchForm from "./SearchForm";
import SortButton from "./SortButton";
import TableComponent from "./TableComponent";
import SaveButton from "./SaveButton";

function TableCard() {
  const dispatch = useDispatch();

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
  const [searchFlag, setSearchFlag] = useState(false);

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

  function setSearchFlagFunc(bool) {
    setSearchFlag(bool);
  }
  function setVisibleFunc(bool) {
    setVisible(bool);
  }
  function setDynamicFlagFunc(bool) {
    setDynamicFlag(bool);
  }
  function setSelectedCharFunc(value) {
    setSelectedChar(value);
  }
  function setSelectedCompareCharFunc(value) {
    setSelectedCompareChar(value);
  }
  function setCompareFlagFunc(bool) {
    setCompareFlag(bool);
  }
  function setCurrentCharCodeFunc(value) {
    setCurrentCharCode(value);
  }
  return (
    <>
      <Context.Provider
        value={{
          setDynamicFlagFunc,
          setSelectedCharFunc,
          setSelectedCompareCharFunc,
          setVisibleFunc,
          setCompareFlagFunc,
          setSearchFlagFunc,
          setCurrentCharCodeFunc,
        }}
      >
        <div className="main">
          <GetBase />
          <div>
            <h1>Курс Валют</h1>
            <Button
              type="primary"
              onClick={() => {
                setSearchFlag(true);
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
            <SearchForm flag={searchFlag} />
            <CompareForm flag={searchFlag} />
          </div>
          {loading && <div className="loader"></div>}

          {!loading && selectedChar && (
            <>
              <SortButton />
              <TableComponent
                date={currentDate}
                dataSource={selectedChar !== "Все" ? newArr : reduxRates}
                visibleFlag={visible}
              />
            </>
          )}
          {!loading && visible && !selectedChar && (
            <>
              <SortButton />
              <TableComponent
                date={currentDate}
                dataSource={reduxRates && reduxRates}
                visibleFlag={visible}
              />
            </>
          )}
          {dynamicFlag && <Graph charCode={currentCharCode} />}
          {!loading && compareFlag && (
            <>
              <SortButton />
              <div className="compareTable">
                <TableComponent
                  date={currentDate}
                  dataSource={selectedCompareChar ? newArr2 : reduxRates}
                  visibleFlag={visible}
                />
                <TableComponent
                  date={currentCompareDate}
                  dataSource={
                    selectedCompareChar ? newCompareArr : reduxCompareRates
                  }
                  visibleFlag={visible}
                />
              </div>
            </>
          )}
          {!loading && (visible || compareFlag) && (
            <SaveButton
              selectedChar={selectedChar}
              selectedCompareChar={selectedCompareChar}
              newArr={newArr}
              newArr2={newArr2}
              newCompareArr={newCompareArr}
            />
          )}
        </div>
      </Context.Provider>
    </>
  );
}

export default TableCard;
