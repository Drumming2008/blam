const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user.ts");
router.get("/user/", (req, res) => {
  UserSchema.find({})
    .then((users) => {
      console.log("succesfully got entire db");
      console.log(users);
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/users/:id", (req, res) => {
  userSchema
    .findById(req.params.id)
    .then((user) => {
      console.log("succesfully got user");
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/users/add", (req, res) => {
  userSchema
    .create({
      registration: req.body.registration,
      model: req.body.model,
      airline: req.body.airline,
      category: req.body.category,
      image: req.body.image,
    })
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error creating record");
    });
});

router.put("/users/", (req, res) => {
  const { id, update } = req.body;

  userSchema
    .findByIdAndUpdate(id, update, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      console.log("Successfully updated!");
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "user updating document" });
    });
});

router.delete("/users/:id", (req, res) => {
  userSchema
    .findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.send(deleted);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
