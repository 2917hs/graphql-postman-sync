// src/config/index.ts
import path from "node:path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const env = process.env.NODE_ENV || "dev";

let envConfig;
try {
  const module = await import(`./${env}.config.ts`);
  envConfig = module.default;
} catch {
  console.error(`❌ No config found for environment: ${env}`);
  process.exit(1);
}

export const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
export const WORKSPACE_ID = process.env.WORKSPACE_ID;

export const schemaPathArg = process.argv[2]!;
export const schemaPath = path.isAbsolute(schemaPathArg)
  ? schemaPathArg
  : path.join(process.cwd(), schemaPathArg);

export const COLLECTION_VARIABLES = {
  environment: envConfig.environment,
  version: envConfig.version,
  graphql_url: envConfig.graphql_url
};

if (!POSTMAN_API_KEY) {
  console.error("❌ Please set POSTMAN_API_KEY environment variable");
  process.exit(1);
}
