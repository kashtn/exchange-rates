import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import Day from "./models/Day.js";
import { resolve } from "path";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mongoose.connect("mongodb://localhost:27017/cbr_base", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

mongoose.connect('mongodb+srv://ivan_musk:whitesector1488@exchange-rates.byyid.mongodb.net/cbr_base' || "mongodb://localhost:27017/cbr_base", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.listen(666, () => {
  console.log("Listening to Hell...");
});

app.post("/saveRates", (req, res) => {
  let fileToSave = req.body;
  if (fileToSave) {
    fs.writeFile("rates.json", JSON.stringify(fileToSave), function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.json(true);
  } else {
    res.json(false);
  }
});

app.post("/setBase", async (req, res) => {
  console.log("server");
  let base = req.body;
  let date = base["@attributes"].Date;
  const thisDay = await Day.findOne({ date });
  if (!thisDay) {
    console.log('condition');
    let valutes = base.Valute;
    let newDay = new Day({ date, valutes });
    newDay.save().then(() => {
      console.log('saved');
      res.json("ok");
    });
  }else{
    res.json("ok");
  }
});
