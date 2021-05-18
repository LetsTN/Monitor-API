import mongoose, { Document, Model } from 'mongoose';

export interface Module {
  _id?: string;
  raspberry: string;
}

const schema = new mongoose.Schema(
  {
    raspberry: { type: String, required: true },
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

interface ModuleModel extends Omit<Module, '_id'>, Document {}
export const Module: Model<ModuleModel> = mongoose.model('Module', schema);