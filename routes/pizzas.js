import PizzaType from "../models/PizzaType.js";
import Pizza from "../models/Pizza.js";

export default async function (server, opts) {
  server.get("/api/pizzas", async (req, res) => {
    try {
      const pizzaTypes = await PizzaType.find({});
      const pizzas = await Pizza.find({});

      const response = pizzaTypes.map((pizza) => {
        const matchingPizza = pizzas.find((p) => p.id === pizza.pizza_type_id);
        return {
          id: pizza.pizza_type_id,
          name: pizza.name,
          category: pizza.category,
          description: pizza.ingredients,
          image: `/public/pizzas/${pizza.pizza_type_id}.webp`,
          sizes: matchingPizza ? matchingPizza.sizes : {},
        };
      });

      res.send(response);
    } catch (err) {
      req.log.error(err);
      res.code(500).send({ message: "Failed to fetch pizzas" });
    }
  });
}
