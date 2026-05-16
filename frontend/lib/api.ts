import { Protest } from "@/lib/mock-data";

const API_URL = "http://127.0.0.1:8000";

/**
 * Fetch all protests from backend
 */
export async function fetchProtestsFromBackend(): Promise<Protest[]> {
  const res = await fetch(`${API_URL}/protests`);

  if (!res.ok) {
    throw new Error("Failed to fetch protests");
  }

  return res.json();
}

/**
 * Submit a new protest
 */
export async function submitProtest(data: any) {
  const cleanedData = {
    title: data.title,
    description: data.description,
    date: data.date,
    type: data.type,
    location: {
      lat: data.location.lat,
      lng: data.location.lng,
      address: data.location.address,
    },
  };

  console.log("CLEANED DATA:", cleanedData);

  const res = await fetch(`${API_URL}/protests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanedData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to submit protest: ${errorText}`);
  }

  return res.json();
}