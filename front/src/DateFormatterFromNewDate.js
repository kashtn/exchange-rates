export default function dateFormatterFromNewDate(date) {
  let chosenDate = date;
  let day = chosenDate.getDate();
  let month = chosenDate.getMonth() + 1;
  let year = chosenDate.getFullYear();
  day = day <= 9 ? "0" + day : day;
  month = month <= 9 ? "0" + month : month;
  let dateForSearch = day + "/" + month + "/" + year;
  return dateForSearch;
}
