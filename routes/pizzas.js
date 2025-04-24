import PizzaType from "../models/PizzaType.js";
import Pizza from "../models/Pizza.js";

export default async function (server, opts) {
  server.get("/api/pizzas", async (req, res) => {
    try {
      const pizzaTypes = await PizzaType.find({});
      const pizzasSizes = await Pizza.find({});

      const response = pizzaTypes.map((pizza) => {
        const sizes = {};
        pizzasSizes.forEach((p) => {
          if (p.pizza_type_id === pizza.pizza_type_id) {
            sizes[p.size] = p.price;
          }
        });

        return {
          id: pizza.pizza_type_id,
          name: pizza.name,
          category: pizza.category,
          description: pizza.ingredients,
          image: `/public/images/${pizza.pizza_type_id}.webp`,
          sizes,
        };
      });

      res.send(response);
    } catch (err) {
      req.log.error(err);
      res.code(500).send({ message: "Failed to fetch pizzas" });
    }
  });
}
