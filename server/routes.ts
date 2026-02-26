import * as Express from "express";
import { assignTargets, blammo } from "./functions";
import { type User, UserSchema } from "./models/user.ts";
import { type Report, ReportSchema } from "./models/reports.ts";
import { requireAdmin } from "./auth";

const router = Express.Router();
router.get(
  "/users/",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    UserSchema.find({})
      .then((users: User[]) => {
        console.log("successfully got entire db");
        console.log(users);
        res.json(users);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  },
);

router.get("/leaderboard", (req: Express.Request, res: Express.Response) => {
  UserSchema.find({}, { name: 1, grade: 1, score: 1, alive: 1, _id: 0 })
    .then((users: User[]) => {
      res.json(users);
    })
    .catch((err: Error) => {
      console.error(err);
    });
});

router.post(
  "/users/add",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    UserSchema.create({
      name: req.body.name,
      email: req.body.email,
      grade: req.body.grade,
    })
      .then((user: User) => {
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
    const { id, update }: { id: string; update: Partial<User> } = req.body;
    UserSchema.findByIdAndUpdate(id, update, { returnDocument: "after" })
      .then((user: User | null) => {
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
      .then((deleted: User | null) => {
        res.send(deleted);
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

router.get(
  "/users/:id",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    UserSchema.findById(req.params.id)
      .then((user: User | null) => {
        console.log("succesfully got user");
        console.log(user);
        res.json(user);
      })
      .catch((err: Error) => {
        console.error(err);
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

router.post(
  "/blammo",
  requireAdmin,
  async (req: Express.Request, res: Express.Response) => {
    try {
      await blammo(req.body.user);
      res.json({ message: "user blammoed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error executing blammo", err });
    }
  },
);
router.post("/reports/add", (req: Express.Request, res: Express.Response) => {
  ReportSchema.create({
    user: req.body.user,
    target: req.body.target,
    method: req.body.method,
  })
    .then((report: Report) => {
      console.log(report);
      res.json(report);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send("error creating record");
    });
});

router.get(
  "/reports/",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    Report.find({})
      .then((reports: Report[]) => {
        console.log("successfully got entire db");
        console.log(reports);
        res.json(reports);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  },
);

router.post(
  "/auth/",
  requireAdmin,
  (req: Express.Request, res: Express.Response) => {
    res.status(200).json({ message: "OK" });
  },
);

export { router };
