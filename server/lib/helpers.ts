import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

export function generateQuery(
  queryTemplate: string,
  variables: Record<string, string>,
  queryDataTypes: Record<string, string>,
): any {
  // Parse the query template string into an object
  const queryObj = JSON.parse(
    queryTemplate.replace(/var\((\w+)\)/g, '"__$1__"'),
  );

  // Process the object as before
  return processQueryObj(queryObj, variables, queryDataTypes);
}

function processQueryObj(
  queryObj: any,
  variables: Record<string, string>,
  queryDataTypes: Record<string, string>,
): any {
  if (typeof queryObj === 'string') {
    const match = queryObj.match(/__([^_]+)__/);
    if (match) {
      const varName = match[1];
      const dataType = queryDataTypes[varName] || 'string';
      let value: string | number | boolean | Date;

      if (dataType === 'number') {
        value = Number(variables[varName]);
      } else if (dataType === 'boolean') {
        value = variables[varName] === 'true';
      } else if (dataType === 'date') {
        value = new Date(variables[varName]);
      } else {
        value = variables[varName];
      }

      return value;
    }
  } else if (typeof queryObj === 'object' && queryObj !== null) {
    const newObj: any = Array.isArray(queryObj) ? [] : {};
    for (const key in queryObj) {
      newObj[key] = processQueryObj(queryObj[key], variables, queryDataTypes);
    }
    return newObj;
  }

  return queryObj;
}

export function extractVariables(query: string) {
  const regex = /"__(.*?)__"/g;
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

export async function encryptData(data: string) {
  try {
    const iv = randomBytes(16);
    const password = process.env.ENCRYPTION_KEY || '';
    const key = scryptSync(password, 'salt', 32);

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedDbConnectionString = `${iv.toString('hex')}:${encrypted}`;

    return encryptedDbConnectionString;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
}

export async function decryptData(encryptedData: string) {
  try {
    const password = process.env.ENCRYPTION_KEY || '';
    const key = scryptSync(password, 'salt', 32);

    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const encrypted = encryptedData.slice(33);

    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
}

export function safeJsonParse(str: string | undefined) {
  try {
    return str ? JSON.parse(str) : {};
  } catch (err) {
    console.error(`Failed to parse JSON string: ${str}`, err);
    return {};
  }
}
