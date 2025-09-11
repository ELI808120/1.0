
import type { Handler } from "@netlify/functions";

// This function now simply returns the static Gumroad product URL.
// The URL is stored in an environment variable for easy management.
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { GUMROAD_PRODUCT_URL } = process.env;

  if (!GUMROAD_PRODUCT_URL) {
    console.error("Server configuration error: Missing GUMROAD_PRODUCT_URL environment variable.");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server configuration error: Payment URL is not configured." }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ url: GUMROAD_PRODUCT_URL }),
  };
};

export { handler };
