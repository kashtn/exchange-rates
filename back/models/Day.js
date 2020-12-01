import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DaySchema = new Schema({
  date: String,
  valutes: [
    {
      ID: String ,
      NumCode: String,
      CharCode: String,
      Nominal: String,
      Name: String,
      Value: String,
    },
  ],
});

export default model("Day", DaySchema);
