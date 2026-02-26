import * as Express from "express";

export function requireAdmin(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const token = req.headers["api-auth"];
  if (!token || token !== process.env.SECRET) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  next();
}
