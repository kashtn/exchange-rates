import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import Day from "./back/models/Day.js";
import path from "path";

// import cors_proxy from "cors-anywhere";

// cors_proxy
//   .createServer({
//     originWhitelist: [],
//     requireHeader: ["origin", "x-requested-with"],
//     removeHeaders: ["cookie", "cookie2"],
//   })
const __dirname = path.resolve();
let app = express();
const PORT = process.env.PORT || 666;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/cbr_base",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

if (process.env.NODE_ENV === "production") {
  // app.use(express.static('../front/build'))
  app.use(express.static(path.join(__dirname, "front/build")));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`CORS anywhere and Server are running at ${PORT}...`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
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
    console.log("condition");
    let valutes = base.Valute;
    let newDay = new Day({ date, valutes });
    newDay.save().then(() => {
      console.log("saved");
      res.json("ok");
    });
  } else {
    res.json("ok");
  }
});
