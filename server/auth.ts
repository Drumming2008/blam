import * as Express from "express";

export function requireAdmin(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const token = req.headers["authorization"];
  console.log("cheese tax:");
  console.log(token);
  console.log(process.env.SECRET);
  if (!token || token !== process.env.SECRET) {
    return res.status(401).json({ message: "unauthorized" });
  }

  next();
}
