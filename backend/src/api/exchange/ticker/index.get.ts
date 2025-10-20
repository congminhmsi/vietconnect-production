import { RedisSingleton } from "@b/utils/redis";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseTickerSchema } from "../utils";
import { createError } from "@b/utils/error";

const redis = RedisSingleton.getInstance();

export const metadata: OperationObject = {
  summary: "Get All Market Tickers",
  operationId: "getAllMarketTickers",
  tags: ["Exchange", "Markets"],
  description: "Retrieves ticker information for all available market pairs.",
  responses: {
    200: {
      description: "All market tickers information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseTickerSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ticker"),
    500: serverErrorResponse,
  },
};

export default async () => {
  const cachedData = await redis.get("exchange:tickers");

  if (!cachedData) {
    throw createError(404, "No tickers found in cache");
  }

  try {
    // Try to parse as regular JSON first
    const tickers = JSON.parse(cachedData || "{}");
    return tickers;
  } catch (error) {
    // If JSON parsing fails, try to fix the format by adding quotes around keys
    try {
      // Fix Redis format: remove single quotes and add quotes around ALL keys
      let fixedData = cachedData;
      
      // Remove single quotes at the beginning and end
      fixedData = fixedData.replace(/^'|'$/g, '');
      
      // Fix outer keys (BTC/USDT, ETH/USDT, etc.)
      fixedData = fixedData.replace(/([A-Z]+[A-Z0-9]*\/[A-Z]+[A-Z0-9]*):/g, '"$1":');
      
      // Fix inner keys (last, baseVolume, quoteVolume, change)
      fixedData = fixedData.replace(/([a-zA-Z]+):/g, '"$1":');
      
      const tickers = JSON.parse(fixedData);
      return tickers;
    } catch (fixError) {
      console.error("Failed to parse ticker data:", error.message);
      console.error("Failed to fix ticker data:", fixError.message);
      console.error("Raw data:", cachedData.substring(0, 100) + "...");
      throw createError(500, "Invalid ticker data format");
    }
  }
};
