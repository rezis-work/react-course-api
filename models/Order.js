import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  data: String,
  time: String,
  items: [
    {
      pizzaId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
