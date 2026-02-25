import { UserSchema } from "./models/user.ts";

async function assignTargets(): Promise<void> {
  const users = await UserSchema.find({});

  const ids: string[] = users.map(u => u._id.toString());

  function derange(arr: string[]): string[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    if (shuffled.every((v, i) => v !== arr[i])) return shuffled;
    return derange(arr);
  }

  const shuffled = derange(ids);

  await Promise.all(
    users.map((user, i) => UserSchema.findByIdAndUpdate(user._id, { target: shuffled[i] }))
  );
}

export { assignTargets };
