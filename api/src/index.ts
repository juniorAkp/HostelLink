import express from "express";
import { initDb } from "../helpers/initDb";
import router from "../routes/auth";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", router);

app.listen(PORT, async () => {
  await initDb();
  console.log(`server is running on http://localhost:${PORT}`);
});
