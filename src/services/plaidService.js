const API_BASE_URL = "http://10.51.180.74:5000";
export async function createLinkToken() {
  const response = await fetch(`${API_BASE_URL}/api/create_link_token`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create Plaid link token");
  }

  return response.json();
}

export async function exchangePublicToken(publicToken) {
  const response = await fetch(`${API_BASE_URL}/api/exchange_public_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_token: publicToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange public token");
  }

  return response.json();
}

export async function getPlaidTransactions() {
  const response = await fetch(`${API_BASE_URL}/api/transactions`);

  if (!response.ok) {
    throw new Error("Failed to fetch Plaid transactions");
  }

  return response.json();
}