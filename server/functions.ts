import { type User, UserSchema } from "./models/user.ts";

export async function assignTargets(): Promise<void> {
  const users = await UserSchema.find({});

  const ids: string[] = users.map((u) => u._id.toString());

  function derange(arr: string[]): string[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    if (shuffled.every((v, i) => v !== arr[i])) return shuffled;
    return derange(arr);
  }

  const shuffled = derange(ids);

  await Promise.all(
    users.map((user, i) =>
      UserSchema.findByIdAndUpdate(user._id, { target: shuffled[i] }),
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
