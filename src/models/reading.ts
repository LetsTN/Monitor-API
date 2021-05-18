import mongoose, { Document, Model } from 'mongoose';

export interface Reading {
  _id?: string;
  module: string; 
  co: number;
  glp: number;
  bpm: number;
  time: Date;
}

const schema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    co: { type: Number, required: true },
    glp: { type: Number, required: true },
    bpm: { type: Number, required: true },
    time: { type: Date, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface ReadingModel extends Omit<Reading, '_id'>, Document {}
export const Reading: Model<ReadingModel> = mongoose.model('Reading', schema);