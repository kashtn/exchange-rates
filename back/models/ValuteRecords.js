import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ValuteRecordsSchema = new Schema({
  charCode: String,
  records: [
    {
      "@attributes": {
        Date: String,
        Id: String,
      },
      Value: String,
    },
  ],
});

export default model("ValuteRecords", ValuteRecordsSchema);
