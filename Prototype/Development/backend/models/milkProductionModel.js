import mongoose from "mongoose";
import Animal from "./animalModel.js";

const singleAnimalRecordSchema = mongoose.Schema()

const milkRecordSchema = mongoose.Schema(
    {
        morning: {
            type: Number,
            required: true
        },
        evening: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            required: true
        }
    },
)

const milkProductionSchema = mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Farm'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
    record: {
        type: Map,
        of: milkRecordSchema,
        required: true   
    }
  },
  {
    timestamps: true,
  }
);

const MilkProduction = mongoose.model("MilkProduction", milkProductionSchema);

export default MilkProduction;
