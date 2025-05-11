import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";
import PizzaType from "../models/PizzaType.js";

export default async function (server, opts) {
  server.post("/api/orders", async (req, res) => {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      res.code(400).send({ message: "Invalid cart data" });
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: false });
    const date = now.toISOString().split("T")[0];

    const mergedCart = cart.reduce((acc, item) => {
      const id = item.pizza.id;
      const size = item.size.toLowerCase();
      const pizzaId = `${id}_${size}`;

      if (!acc[pizzaId]) {
        acc[pizzaId] = { pizzaId, quantity: 1 };
      } else {
        acc[pizzaId].quantity += 1;
      }

      return acc;
    }, {});

    const orderItems = Object.values(mergedCart);

    const order = await Order.create({ date, time, items: orderItems });

    res.code(201).send({ orderId: order._id });
  });

  server.get("/api/order", async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res.code(400).send({ message: "Order ID is required" });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.code(404).send({ error: "Order not found" });
      return;
    }

    const orderItems = await Promise.all(
      order.items.map(async ({ pizzaId, quantity }) => {
        const [pizza_type_id, size] = pizzaId.split("_");
        const pizzaType = await PizzaType.findOne({ pizza_type_id });
        const pizza = await Pizza.findOne({ id: pizza_type_id });

        if (!pizzaType || !pizza) {
          console.error(
            `No records found for pizza_type_id: ${pizza_type_id}, size: ${size}`
          );
          return null;
        }

        const price = pizza.sizes[size.toUpperCase()] || 0;

        console.log(pizzaType);
        console.log(pizza);

        return {
          pizzaTypeId: pizza_type_id,
          name: pizzaType.name,
          category: pizzaType.category,
          description: pizzaType.description,
          size,
          quantity,
          price,
          total: price * quantity,
          image: `/images/pizzas/${pizza_type_id}.webp`,
        };
      })
    );

    const total = orderItems.reduce((acc, item) => acc + item.total, 0);

    res.send({
      order: { id: order._id, date: order.date, time: order.time, total },
      orderItems,
    });
  });

  server.get("/api/orders", async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({}, { _id: 1, time: 1 })
      .sort({
        _id: -1,
      })
      .skip(skip)
      .limit(limit);
    console.log(orders);
    res.send(
      orders.map((order) => ({
        id: order._id,
        time: order.time,
        totalPage: Math.floor(orders.length / limit),
      }))
    );
  });

  server.get("/api/past-order/:order_id", async (req, res) => {
    const id = req.params.order_id;

    const order = await Order.findById(id);
    if (!order) {
      res.code(404).send({ error: "Order not found" });
      return;
    }

    const orderItems = await Promise.all(
      order.items.map(async ({ pizzaId, quantity }) => {
        const [pizza_type_id, size] = pizzaId.split("_");
        const pizzaType = await PizzaType.findOne({ pizza_type_id });
        const pizza = await Pizza.findOne({ id: pizza_type_id });

        if (!pizzaType || !pizza) {
          console.error(
            `Missing data for pizza_type_id: ${pizza_type_id}, size: ${size}`
          );
          return {
            pizzaTypeId: pizza_type_id,
            name: "Unknown Pizza",
            category: "Unknown",
            description: "Not available",
            size,
            quantity,
            price: 0,
            total: 0,
            image: "/images/pizzas/default.webp",
          };
        }

        const price = pizza.sizes[size.toUpperCase()] || 0;

        return {
          pizzaTypeId: pizza_type_id,
          name: pizzaType.name,
          category: pizzaType.category,
          description: pizzaType.ingredients || "No description",
          size,
          quantity,
          price,
          total: price * quantity,
          image: pizza.image || `/images/pizzas/${pizza_type_id}.webp`,
        };
      })
    );

    const total = orderItems.reduce((acc, item) => acc + item.total, 0);

    res.send({
      order: { id: order._id, date: order.date, time: order.time, total },
      orderItems,
    });
  });
}
