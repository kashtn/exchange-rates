import { Popover, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, cleanFilter, alphabetFilter } from "../../redux/actions";

export default function SortButton() {
  const dispatch = useDispatch();

  const {reduxRates, reduxCompareRates} = useSelector(state => state)

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

  return (
    <>
      <Popover content={content} trigger="click">
        <Button type="link">Сортировать</Button>
      </Popover>
    </>
  );
}
