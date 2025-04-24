import mongoose from "mongoose";

const PizzaTypeSchema = new mongoose.Schema({
  pizza_type_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  ingredients: String,
});

const PizzaType = mongoose.model("PizzaType", PizzaTypeSchema);

export default PizzaType;
