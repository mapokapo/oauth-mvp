import { db } from "./db";

export type User = { sub: string; email: string; password_hash: string };
export type UserWithoutPassword = Omit<User, "password_hash">;

export const createUser = async (
  email: string,
  password: string
): Promise<UserWithoutPassword> => {
  const sub = crypto.randomUUID();
  const passwordHash = await Bun.password.hash(password);

  const statement = db.prepare<User, Record<string, string>>(
    `INSERT INTO users (sub, email, password_hash) VALUES ($sub, $email, $passwordHash)`
  );
  statement.run({
    $sub: sub,
    $email: email,
    $passwordHash: passwordHash,
  });

  return { sub, email };
};

export const verifyUser = async (
  email: string,
  password: string
): Promise<UserWithoutPassword | null> => {
  const statement = db.prepare<User, string>(
    `SELECT sub, password_hash FROM users WHERE email = ?`
  );

  const row = statement.get(email);
  if (!row) return null;

  const { sub, password_hash: hash } = row;

  const ok = await Bun.password.verify(password, hash);
  if (!ok) return null;

  return { sub, email };
};

export const getUserBySub = (sub: string): UserWithoutPassword | null => {
  const statement = db.prepare<User, string>(
    `SELECT sub, email FROM users WHERE sub = ?`
  );

  const row = statement.get(sub);
  if (!row) return null;

  const { sub: s, email } = row;
  return { sub: s, email };
};
