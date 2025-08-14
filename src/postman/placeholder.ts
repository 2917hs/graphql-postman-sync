/**
 * Return placeholder values for GraphQL variables
 */
export function guessPlaceholderValue(typeName: string) {
  if (typeName.includes("ID")) return "123";
  if (typeName.includes("Int")) return 0;
  if (typeName.includes("Float")) return 0.0;
  if (typeName.includes("Boolean")) return true;
  return "example";
}
