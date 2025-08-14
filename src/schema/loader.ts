import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import type { GraphQLSchema } from "graphql";

export async function loadGraphQLSchema(schemaPath: string): Promise<GraphQLSchema> {
  return loadSchema(schemaPath, {
    loaders: [new GraphQLFileLoader(), new JsonFileLoader()],
  });
}
