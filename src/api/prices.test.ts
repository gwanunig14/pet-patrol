import { getPrices } from "@/api/prices";

describe("prices api", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  test("returns prices", async () => {
    const prices = { pig: 15, dog: 10, cat: 5 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => prices,
    });

    await expect(getPrices()).resolves.toEqual(prices);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/prices");
  });

  test("throws on failed response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 });
    await expect(getPrices()).rejects.toThrow("Could not load prices: 404");
  });

  test("throws when prices are missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => null,
    });
    await expect(getPrices()).rejects.toThrow("prices not found");
  });
});
