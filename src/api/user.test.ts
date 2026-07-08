import { getUser } from "@/api/user";

describe("user api", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  test("returns valid user", async () => {
    const users = {
      owner: { name: "owner", password: "secret" },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => users,
    });

    await expect(
      getUser({ name: "owner", password: "secret" }),
    ).resolves.toEqual(users.owner);
  });

  test("throws on missing user", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(
      getUser({ name: "owner", password: "secret" }),
    ).rejects.toThrow("user not found");
  });

  test("throws on incorrect password", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ owner: { name: "owner", password: "secret" } }),
    });

    await expect(getUser({ name: "owner", password: "wrong" })).rejects.toThrow(
      "incorrect password",
    );
  });

  test("throws on failed response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    await expect(getUser({ name: "owner", password: "x" })).rejects.toThrow(
      "Could not load users: 500",
    );
  });
});
