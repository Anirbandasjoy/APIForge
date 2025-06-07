import fs from 'fs';
import path from 'path';

export const loadEmailTemplate = (
  templateName: string,
  variables: Record<string, string>
): string => {
  const filePath = path.join(__dirname, '..', 'templates', templateName);

  let html = fs.readFileSync(filePath, 'utf-8');

  for (const key in variables) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(placeholder, variables[key]);
  }

  return html;
};
