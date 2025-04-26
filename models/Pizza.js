import mongoose from "mongoose";

const PizzaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sizes: {
    S: { type: Number, required: true },
    M: { type: Number, required: true },
    L: { type: Number, required: true },
  },
});

const Pizza = mongoose.model("Pizza", PizzaSchema);

export default Pizza;
