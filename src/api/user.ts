const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface User {
  name: string;
  password: string;
}

export async function getUser(user: User): Promise<User> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error(`Could not load users: ${response.status}`);
  }

  const users: Record<string, User> = await response.json();
  const currentUser = users[user.name];

  if (!currentUser) {
    throw new Error("user not found");
  }

  if (currentUser.password !== user.password) {
    throw new Error("incorrect password");
  }

  return currentUser;
}
