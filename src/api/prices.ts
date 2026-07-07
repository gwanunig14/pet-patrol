const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Prices {
  pig: number;
  dog: number;
  cat: number;
}

export async function getPrices(): Promise<Prices> {
  const response = await fetch(`${API_URL}/prices`);

  if (!response.ok) {
    throw new Error(`Could not load prices: ${response.status}`);
  }

  const prices = await response.json();

  if (!prices) {
    throw new Error("prices not found");
  }

  return prices;
}
