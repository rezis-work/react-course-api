import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import pizzaRoutes from "./routes/pizzas.js";
import pizzaOfTheDayRoutes from "./routes/pizzaOfTheDay.js";
import orderRoutes from "./routes/orders.js";

const server = fastify({ logger: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public",
});

await connectDB();

server.register(pizzaRoutes);
server.register(pizzaOfTheDayRoutes);
server.register(orderRoutes);

export default server;
