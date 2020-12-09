import express from "express";
import mongoose from "mongoose";
import Day from "./back/models/Day.js";
import ValuteRecords from "./back/models/ValuteRecords.js";

let app = express();
const PORT = process.env.PORT || 666;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://ivan_musk:whitesector1488@exchange-rates.byyid.mongodb.net/cbr_base?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.listen(PORT, () => {
  console.log(`CORS anywhere and Server are running at ${PORT}...`);
});

app.post("/setBase", async (req, res) => {
  console.log("server");
  let base = req.body;
  console.log(base); 
  let date = base && base["@attributes"].Date;
  let attributes = base["@attributes"];
  const thisDay = await Day.findOne({ date });
  if (!thisDay) {
    console.log("new day");
    let valutes = base.Valute;
    let newDay = new Day({
      date,
      "@attributes": attributes,
      Valute: base.Valute,
    });
    newDay.save().then(() => {
      console.log("saved");
      res.json("ok");
    });
  } else {
    console.log("already have this day");
    res.json("ok");
  }
});

app.post("/setRecords", async (req, res) => {
  let records = req.body;
  let currentCharCode = records.charCode;
  const thisRecord = await ValuteRecords.findOne({ charCode: currentCharCode });
  if (!thisRecord) {
    let arr = records.records;
    let newRecords = new ValuteRecords({
      charCode: currentCharCode,
      records: arr,
    });
    newRecords.save();
    res.json("saved");
  } else {
    console.log("have this record");
    res.json("next");
  }
});

app.post("/getCurrentDay", async (req, res) => {
  let currentDay = req.body.date1
    ? req.body.date1.split("/").join(".")
    : req.body.date2.split("/").join(".");
  let dayRates = await Day.findOne({ date: currentDay });
  res.json(dayRates);
});

app.post("/getCurrentDynamic", async (req, res) => {
  let { date1, date2, charCode } = req.body;
  let currentRecord = await ValuteRecords.find({ charCode });
  let allRecords = currentRecord[0].records;
  let firstArr = allRecords.filter((record) => {
    let dateFromBase = record["@attributes"].Date.split(".");
    let fromFrontDay = date1.split("/");
    let fromBase = [dateFromBase[1], dateFromBase[0], dateFromBase[2]];
    let fromFront = [fromFrontDay[1], fromFrontDay[0], fromFrontDay[2]];
    let a = new Date(fromFront.join("."));
    let b = new Date(fromBase.join("."));
    if (a <= b) {
      return record;
    }
  });
  let secondArr = firstArr.filter((record) => {
    let dateFromBase = record["@attributes"].Date.split(".");
    let fromFrontDay = date2.split("/");
    let fromBase = [dateFromBase[1], dateFromBase[0], dateFromBase[2]];
    let fromFront = [fromFrontDay[1], fromFrontDay[0], fromFrontDay[2]];
    let a = new Date(fromFront.join("."));
    let b = new Date(fromBase.join("."));
    if (a >= b) {
      return record;
    }
  });
  let resultArr = secondArr.map((record) => {
    let date = record["@attributes"].Date.split(".");
    let correctDate = [date[1], date[0], date[2]];
    return {
      x: new Date(correctDate.join(".")),
      y: Number(record.Value.split(",").join(".")),
    };
  });
  res.json(resultArr);
});
