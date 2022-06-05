import express from "express";
import cors from "cors";
import path from "path";
import { checkProductAvailability } from "./utils";
require("dotenv").config({ path: "./.env" });
const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, "../../build")));

app.get("/checkProductAvailability", async ({ query: { productSku } }, res) => {
  try {
    const byState = await checkProductAvailability(productSku as string);
    res.json(byState);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log("Apple product checker listening on 3001");
});
