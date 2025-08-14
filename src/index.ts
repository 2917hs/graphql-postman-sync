import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

process.on("uncaughtException", (err: any) => {
  console.error("❌ UncaughtException:", err?.stack ?? JSON.stringify(err, null, 2));
  process.exit(1);
});
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ UnhandledRejection:", reason?.stack ?? JSON.stringify(reason, null, 2));
  process.exit(1);
});

const env = process.env.APP_ENV || process.env.NODE_ENV || "dev";

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function main() {
  const { loadGraphQLSchema } = await import("./schema/loader.js");
  const { buildPostmanCollection } = await import("./postman/collectionBuilder.js");
  const { importOrUpdateCollection } = await import("./postman/importer.js");

  const { default: config } = await import(`./config/${env}.config.ts`);

  console.log(`▶️  Environment: ${env}`);
  console.log(`▶️  POSTMAN_API_KEY: ${process.env.POSTMAN_API_KEY ? "✅ set" : "❌ missing"}`);

  assert(config?.schemaPath, "schemaPath is missing in your environment config.");
  assert(process.env.POSTMAN_API_KEY, "Please set POSTMAN_API_KEY (e.g., in .env).");

  const schema = await loadGraphQLSchema(config.schemaPath);

  const collectionJson: any = buildPostmanCollection(
    schema,
    config.collectionName ?? "GraphQL Auto-Generated"
  );
  collectionJson.variable = Object.entries({
    environment: config.environment,
    version: config.version,
    graphql_url: config.graphql_url
  }).map(([key, value]) => ({ key, value }));

  const localOnly = process.argv.includes("--local-only") || process.env.LOCAL_ONLY === "1";
  const outFile = process.env.OUT_FILE || "postman_collection.json";

  if (localOnly) {
    const outPath = path.isAbsolute(outFile) ? outFile : path.join(process.cwd(), outFile);
    fs.writeFileSync(outPath, JSON.stringify(collectionJson, null, 2), "utf8");
    console.log(`✅ Wrote local collection: ${outPath}`);
    return;
  }

  await importOrUpdateCollection(collectionJson, {
    apiKey: process.env.POSTMAN_API_KEY!,
    collectionName: config.collectionName ?? "GraphQL Auto-Generated",
    workspaceId: config.workspaceId || process.env.WORKSPACE_ID || undefined
  });
}

main();
