import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import axios from 'axios';

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

export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': BREVO_API_KEY,
    };

    const data = {
      sender: { email: 'iamdhritiman01@gmail.com', name: 'Dhritiman Das' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: text, // Assuming the 'text' in the request body is actually HTML content.
    };
    console.log({ data });

    const response = await axios.post(BREVO_ENDPOINT, data, { headers });
    return response.data;
  } catch (error) {
    console.log('Error sending mail:', error.message);
  }
}
