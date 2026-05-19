require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} = require("plaid");

const app = express();

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// This is temporary for testing only.
// Later, we will store access tokens per Firebase user.
let ACCESS_TOKEN = null;

app.get("/", (req, res) => {
  res.json({ message: "Plaid server is running" });
});

app.post("/api/create_link_token", async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "test-user-id",
      },
      client_name: "Expense Tracker",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error.response?.data || error);
    res.status(500).json({
      error: "Failed to create link token",
      details: error.response?.data || error.message,
    });
  }
});

app.post("/api/exchange_public_token", async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    ACCESS_TOKEN = response.data.access_token;

    res.json({
      message: "Public token exchanged successfully",
      item_id: response.data.item_id,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error.response?.data || error);
    res.status(500).json({
      error: "Failed to exchange public token",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    if (!ACCESS_TOKEN) {
      return res.status(400).json({
        error: "No access token yet. Connect a bank first.",
      });
    }

    let cursor = null;
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: ACCESS_TOKEN,
        cursor,
      });

      added = added.concat(response.data.added);
      modified = modified.concat(response.data.modified);
      removed = removed.concat(response.data.removed);

      hasMore = response.data.has_more;
      cursor = response.data.next_cursor;
    }

    res.json({
      added,
      modified,
      removed,
      next_cursor: cursor,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error);
    res.status(500).json({
      error: "Failed to fetch transactions",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Plaid server running on port ${PORT}`);
});