export default function dateFormatterToNewDate(date) {
  let dateArr = date.split("/");
  let dateChange = [dateArr[1], dateArr[0], dateArr[2]];
  let dateResult = new Date(dateChange);
  return dateResult;
}
