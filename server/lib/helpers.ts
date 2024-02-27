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

export function extractVariables(query) {
  const regex = /var\((.*?)\)/g;
  const variables = [];
  let match;

  while ((match = regex.exec(query)) !== null) {
    variables.push({
      variable: match[1],
      type: 'string',
    });
  }

  return variables;
}

export function capitalizeFirstChar(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getLocalTime(timezone: string) {
  if (!!!timezone) return '';
  return (
    new Date().toLocaleTimeString('en-US', { timeZone: timezone }) +
    ' local time'
  );
}
