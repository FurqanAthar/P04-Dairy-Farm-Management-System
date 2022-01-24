import mongoose from "mongoose";

const animalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    inFarm: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Farm",
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

const Animal = mongoose.model("Animal", animalSchema);

export default Animal;
