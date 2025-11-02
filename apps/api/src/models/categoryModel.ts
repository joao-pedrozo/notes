import mongoose from "mongoose";

export interface Category {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends Category, mongoose.Document {}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<CategoryDocument>("Category", categorySchema);
