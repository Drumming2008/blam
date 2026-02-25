const mongoose = require("mongoose");

const server = "127.0.0.1:27017";
const database = "blammo";
class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
      .then(dbSuccess())
      .catch((err: Error) => {
        console.error("Database connection error", err);
      });
  }
}

function dbSuccess() {
  console.log("Database connection successful");
}

module.exports = new Database();
