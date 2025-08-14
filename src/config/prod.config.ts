export default {
  environment: "prod",
  version: "v1",
  graphql_url: "https://dev.example.com/graphql",
  schemaPath: "./schema/schema.graphql", 
  COLLECTION_NAME: "appsync-postman-sync",
  collectionName: "appsync-postman-sync",
  workspaceId: process.env.WORKSPACE_ID ?? ""
};
