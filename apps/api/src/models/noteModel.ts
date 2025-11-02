import mongoose, { InferSchemaType } from "mongoose";

export interface Note {
  title: string;
  content: string;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteDocument extends Note, mongoose.Document {}

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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

export default mongoose.model<NoteDocument>("Note", noteSchema);
