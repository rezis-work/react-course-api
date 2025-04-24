import server from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = () => {
  try {
    server.listen({ port: PORT });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
