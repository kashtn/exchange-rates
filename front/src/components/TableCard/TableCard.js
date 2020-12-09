import "./Table.css";
import "antd/dist/antd.css";
import { useEffect, useReducer } from "react";
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
import reducer from "../reducer";

function TableCard() {
  const dispatch = useDispatch();
  const initialLocalState = {
    visible: false,
    compareFlag: false,
    dynamicFlag: false,
    currentCharCode: "",
    selectedChar: "",
    selectedCompareChar: "",
    searchFlag: false,
  };
  const [state, localDispatch] = useReducer(reducer, initialLocalState);
let name = 'Ivan'
console.log(name);
console.log(typeof name);
let mod = !!name
console.log(mod);
console.log(typeof mod);
  const {reduxRates,reduxCompareRates,currentDate, currentCompareDate, loading, filter} = useSelector(state => state)

  let newArr = [];
  let current =
    state.selectedChar && state.selectedChar !== "Все" && reduxRates
      ? reduxRates.find((rate) => {
          if (rate["@attributes"].ID === state.selectedChar) {
            return rate;
          } else return "";
        })
      : reduxRates;
  newArr.push(current);

  let newArr2 = [];
  let newCurrent =
    state.selectedCompareChar &&
    state.selectedCompareChar !== "Все" &&
    reduxRates
      ? reduxRates.find((rate) => {
          if (rate["@attributes"].ID === state.selectedCompareChar) {
            return rate;
          } else return "";
        })
      : reduxRates;
  newArr2 = [newCurrent];

  let newCompareArr = [];
  let currentCompare =
    state.selectedCompareChar &&
    state.selectedCompareChar !== "Все" &&
    reduxCompareRates
      ? reduxCompareRates.find((rate) => {
          if (rate["@attributes"].ID === state.selectedCompareChar) {
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
    localDispatch({
      type: "setVisible",
      payload: true,
    });
  }, [dispatch]);

  return (
    <>
      <Context.Provider value={{ localDispatch }}>
        <div className="main">
          <GetBase />
          <div>
            <h1>Курс Валют</h1>
            <Button
              type="primary"
              onClick={() => {
                localDispatch({
                  type: "setSearchFlag",
                  payload: true,
                });
                localDispatch({
                  type: "setVisible",
                  payload: true,
                });
                localDispatch({
                  type: "setDynamicFlag",
                  payload: false,
                });
                localDispatch({
                  type: "setCompareFlag",
                  payload: false,
                });
                dispatch(startGetting(""));
                dispatch(cleanFilter());
                dispatch(setCompareRates([]));
              }}
            >
              Показать на сегодня
            </Button>
          </div>
          <div name="dateForm" className="dateForm">
            <SearchForm flag={state.searchFlag} />
            <CompareForm flag={state.searchFlag} />
          </div>
          {loading && <div className="loader"></div>}
          {!loading && state.selectedChar && (
            <>
              <SortButton />
              <TableComponent
                date={currentDate}
                dataSource={state.selectedChar !== "Все" ? newArr : reduxRates}
                visibleFlag={state.visible}
              />
            </>
          )}
          {!loading && state.visible && !state.selectedChar && (
            <>
              <SortButton />
              <TableComponent
                date={currentDate}
                dataSource={reduxRates && reduxRates}
                visibleFlag={state.visible}
              />
            </>
          )}
          {state.dynamicFlag && <Graph charCode={state.currentCharCode} />}
          {!loading && state.compareFlag && (
            <>
              <SortButton />
              <div className="compareTable">
                <TableComponent
                  date={currentDate}
                  dataSource={state.selectedCompareChar ? newArr2 : reduxRates}
                  visibleFlag={state.visible}
                />
                <TableComponent
                  date={currentCompareDate}
                  dataSource={
                    state.selectedCompareChar
                      ? newCompareArr
                      : reduxCompareRates
                  }
                  visibleFlag={state.visible}
                />
              </div>
            </>
          )}
          {!loading && (state.visible || state.compareFlag) && (
            <SaveButton
              selectedChar={state.selectedChar}
              selectedCompareChar={state.selectedCompareChar}
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
