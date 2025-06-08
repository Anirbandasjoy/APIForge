import fs from 'fs';
import path from 'path';

export const loadEmailTemplate = (
  templateName: string,
  variables: Record<string, string>
): string => {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'services',
    'email',
    'templates',
    templateName
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Email template not found at path: ${filePath}`);
  }

  let html = fs.readFileSync(filePath, 'utf-8');

  for (const key in variables) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(placeholder, variables[key]);
  }

  return html;
};
