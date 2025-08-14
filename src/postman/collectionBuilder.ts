import pkg from "postman-collection";
import type { GraphQLSchema } from "graphql";
import { makePostmanRequest } from "./requestBuilder.js";

const { Collection, ItemGroup, Variable } = pkg as any;

export function buildPostmanCollection(schema: GraphQLSchema, collectionName: string) {
  const collection = new Collection({
    info: {
      name: collectionName,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    variable: [new Variable({ key: "graphql_url", value: "http://localhost:4000/graphql" })],
  });

  const rootQuery = schema.getQueryType();
  const rootMutation = schema.getMutationType();

  if (rootQuery) {
    const queryFolder = new ItemGroup({ name: "Queries" });
    Object.entries(rootQuery.getFields()).forEach(([name, field]) => {
      queryFolder.items.add(makePostmanRequest(name, "query", field));
    });
    collection.items.add(queryFolder);
  }

  if (rootMutation) {
    const mutationFolder = new ItemGroup({ name: "Mutations" });
    Object.entries(rootMutation.getFields()).forEach(([name, field]) => {
      mutationFolder.items.add(makePostmanRequest(name, "mutation", field));
    });
    collection.items.add(mutationFolder);
  }

  return collection.toJSON();
}
