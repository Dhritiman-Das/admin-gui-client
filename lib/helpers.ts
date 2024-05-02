export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function blurMongoCredentials(uri: string) {
  return uri.replace(/:\/\/(.*):(.*)@/, "://****:****@");
}

export function extractVariables(query: string) {
  const regex = /"__(.*?)__"/g;
  const variables = [];
  let match;

  while ((match = regex.exec(query)) !== null) {
    variables.push({
      variable: match[1],
      type: "string",
    });
  }

  return variables;
}

export function getLocalTime(timezone: string) {
  if (!!!timezone) return "";
  return (
    new Date().toLocaleTimeString("en-US", { timeZone: timezone }) +
    " local time"
  );
}

export function safeJsonParse(str: string | undefined) {
  try {
    return str ? JSON.parse(str) : {};
  } catch (err) {
    console.error(`Failed to parse JSON string: ${str}`, err);
    return {};
  }
}
