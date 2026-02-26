import { UserSchema } from "./models/user.ts";

export async function assignTargets(): Promise<void> {
  const users = await UserSchema.find({});
  const shuffled = [...users].sort(() => Math.random() - 0.5);
  await Promise.all(
    shuffled.map((user, i) =>
      UserSchema.findByIdAndUpdate(user._id, {
        target: shuffled[(i + 1) % shuffled.length]._id,
      }),
    ),
  );
}

export async function blammo(user: string): Promise<void> {
  const fullUser = await UserSchema.findById(user);
  const targetUser = await UserSchema.findById(fullUser?.target?.toString());
  await UserSchema.findByIdAndUpdate(targetUser?._id, { alive: false });
  await UserSchema.findByIdAndUpdate(user, {
    target: targetUser?.target?.toString(),
  });
  console.log(targetUser);
}
