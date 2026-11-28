import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Service description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Service price is required"],
    min: [0, "Price cannot be negative"],
  },
  duration: {
    type: Number,
    required: [true, "Service duration is required"],
    min: [1, "Duration must be at least 1 minute"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;