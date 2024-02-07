export function generateQuery(
  queryTemplate: string,
  variables: { [key: string]: string },
) {
  let query = queryTemplate;
  for (const key in variables) {
    query = query.replace(`var(${key})`, `"${variables[key]}"`);
  }
  return query;
}
