import * as Express from "express";
import { assignTargets } from "./functions";
import { UserSchema } from "./models/user.ts";
import { requireAdmin } from "./auth";

const router = Express.Router();
router.get("/users/", (req: Express.Request, res: Express.Response) => {
  UserSchema.find({})
    .then((users: User[]) => {
      console.log("successfully got entire db");
      console.log(users);
      res.json(users);
    })
    .catch((err: Error) => {
      console.error(err);
    });
});

router.get("/leaderboard", (req: Express.Request, res: Express.Response) => {
  UserSchema.find({}, { name: 1, score: 1, _id: 0 })
    .then((users: User[]) => {
      res.json(users);
    })
    .catch((err: Error) => {
      console.error(err);
    });
});

router.get("/users/:id", (req: Express.Request, res: Express.Response) => {
  UserSchema.findById(req.params.id)
    .then((user: User | null) => {
      console.log("succesfully got user");
      console.log(user);
      res.json(user);
    })
    .catch((err: Error) => {
      console.error(err);
    });
});

router.post("/users/add", (req: Express.Request, res: Express.Response) => {
  UserSchema.create({
    name: req.body.name,
    email: req.body.email,
    grade: req.body.grade,
  })
    .then((user: object) => {
      console.log(user);
      res.json(user);
    })
      .then((user: object) => {
        console.log(user);
        res.json(user);
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).send("error creating record");
      });
  },
);

router.put(
  "/users/",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    const { id, update }: { id: string; update: object } = req.body;
    UserSchema.findByIdAndUpdate(id, update, { new: true })
      .then((user: object | null) => {
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
        console.log("Successfully updated!");
        console.log(user);
        res.json(user);
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).json({ message: "user updating document" });
      });
  },
);

router.delete(
  "/users/:id",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    UserSchema.findByIdAndDelete(req.params.id)
      .then((deleted: object | null) => {
        res.send(deleted);
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

router.post(
  "/assign-targets",
  requireAdmin,
  async (req: Express.Request, res: Express.Response) => {
    try {
      await assignTargets();
      res.json({ message: "targets assigned" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error assigning targets", err });
    }
  },
);

export { router };
