import PizzaType from "../models/PizzaType.js";
import Pizza from "../models/Pizza.js";

export default async function (server, opts) {
  server.get("/api/pizza-of-the-day", async (req, res) => {
    try {
      const pizzaTypes = await PizzaType.find({});
      console.log("pizzaTypes", pizzaTypes);

      if (!pizzaTypes.length) {
        res.code(404).send({ message: "No pizza types found" });
        return;
      }

      const dayIndex = Math.floor(Date.now() / 86400000) % pizzaTypes.length;
      const pizza = pizzaTypes[dayIndex];

      const sizes = await Pizza.find({ pizza_type_id: pizza.pizza_type_id });
      console.log("sizes", sizes);

      const sizeObj = sizes.reduce((acc, item) => {
        acc[item.size] = item.price;
        return acc;
      }, {});

      res.code(200).send({
        id: pizza.pizza_type_id,
        name: pizza.name,
        category: pizza.category,
        description: pizza.ingredients,
        image: `/public/images/${pizza.pizza_type_id}.webp`,
        sizes: sizeObj,
      });
    } catch (error) {
      req.log.error(error);
      res.code(500).send({ message: "Failed to fetch pizza of the day" });
    }
  });
}
