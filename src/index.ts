import express from "express";
import dotenv from "dotenv";

dotenv.config();
import bodyParser from "body-parser";
import postsRouter from "./routes/posts";
import errorHandler from "./middleware/errorHandler";
import connectDB from "./config/database";

const app = express();

app.use(bodyParser.json());

connectDB();
app.use("/posts", postsRouter);

// Error handler middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
