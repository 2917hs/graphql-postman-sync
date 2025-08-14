// src/postman/generator.ts
import type { GraphQLSchema } from "graphql";

export function generateCollection(
  _schema: GraphQLSchema,
  vars: Record<string, string | number | boolean> = {}
) {
  return {
    info: {
      name: "GraphQL Auto-Generated",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: Object.entries(vars).map(([key, value]) => ({ key, value })),
    item: []
  };
}
