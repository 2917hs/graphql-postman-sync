export default {
  environment: "dev",
  version: "v1",
  graphql_url: "https://dev.example.com/graphql",
  schemaPath: "./schema/schema.graphql", 
  collectionName: "appsync-postman-sync",
  workspaceId: process.env.WORKSPACE_ID ?? ""
};
