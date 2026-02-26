import mongoose, { type InferSchemaType, Schema } from "mongoose";

const reportSchema = new Schema({
  user: {
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
  active: {
    type: Boolean,
    default: true,
  },
});

export type Report = InferSchemaType<typeof reportSchema>;

export const ReportSchema = mongoose.model("Report", reportSchema);
