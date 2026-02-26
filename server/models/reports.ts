import mongoose, { type InferSchemaType, Schema } from "mongoose";

const reportSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    default: "",
  },
});

export type Report = InferSchemaType<typeof reportSchema>;

export const ReportSchema = mongoose.model("Report", reportSchema);
