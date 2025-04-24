import mongoose from "mongoose";

const PizzaSchema = new mongoose.Schema({
  pizza_type_id: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

const Pizza = mongoose.model("Pizza", PizzaSchema);

export default Pizza;
