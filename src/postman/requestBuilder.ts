import type { GraphQLField, GraphQLArgument } from "graphql";
import { guessPlaceholderValue } from "./placeholder.js";
export function makePostmanRequest(
  name: string,
  type: "query" | "mutation",
  field: GraphQLField<any, any>
) {
  const args = field.args;
  const variableDefinitions = args.length
    ? `(${args.map((a) => `$${a.name}: ${a.type}`).join(", ")})`
    : "";
  const argUsage = args.length
    ? `(${args.map((a) => `${a.name}: $${a.name}`).join(", ")})`
    : "";
  const selectionSet = "{\n    __typename\n  }";
  const queryString = `${type} ${name}${variableDefinitions} {\n  ${name}${argUsage} ${selectionSet}\n}`;

  const variables: Record<string, any> = args.reduce((acc: Record<string, any>, a: GraphQLArgument) => {
    acc[a.name] = guessPlaceholderValue(a.type.toString());
    return acc;
  }, {});

  return {
    name: `${type.toUpperCase()} - ${name}`,
    request: {
      method: "POST",
      header: [{ key: "Content-Type", value: "application/json" }],
      url: "{{graphql_url}}",
      body: {
        mode: "raw",
        raw: JSON.stringify({ query: queryString, variables }, null, 2),
        options: { raw: { language: "json" } },
      },
    },
  };
}
