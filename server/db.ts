import mongoose from "mongoose";

const server = "127.0.0.1:27017";
const databaseName = "blammo";

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(`mongodb://${server}/${databaseName}`)
      .then(dbSuccess)
      .catch((err: Error) => {
        console.error("Database connection error", err);
      });
  }
}

function dbSuccess() {
  console.log("Database connection successful");
}

export const database = new Database();
