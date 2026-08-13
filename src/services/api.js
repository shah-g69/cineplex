const BASE_URL = "https://api.tvmaze.com";

export async function getShows() {
  const response = await fetch(`${BASE_URL}/shows`);

  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }

  return response.json();
}