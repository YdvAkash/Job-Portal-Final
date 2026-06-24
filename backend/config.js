import dotenv from "dotenv";
import { webcrypto } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from standard and legacy env files.
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, ".ENV") });

// Polyfill global crypto for older Node runtimes when using MongoDB's ESM driver.
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
  global.crypto = webcrypto;
}
