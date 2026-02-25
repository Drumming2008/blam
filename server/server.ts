import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes";
import "./db";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => console.log(`server listening on port ${port}!`));
