import fs from "fs";
import express from "express";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.post('/setBase', (req, res) => {
  let base = req.body
  console.log(base);
})