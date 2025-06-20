import express from "express";
import { initDb } from "../helpers/initDb";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, async () => {
  initDb();
  console.log(`server is running on http://localhost:${PORT}`);
});
