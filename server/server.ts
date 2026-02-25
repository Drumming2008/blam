const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");
const database = require("./db");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
