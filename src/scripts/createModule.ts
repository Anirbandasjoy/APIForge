import fs from 'fs';
import path from 'path';

// Helpers
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const camel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// Templates
const templates = {
  controller: (
    mod: string,
    Class: string,
    varName: string
  ) => `import catchAsync from '@/utils/catchAsync';
import { ${varName}Service } from './${mod}.service';
import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export const ${varName}Handler = catchAsync(async (req, res) => {
  const data = await ${varName}Service.create${Class}(req.body);
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: '${Class} request processed',
    data,
  });
});
`,

  service: (
    mod: string,
    Class: string,
    varName: string
  ) => `import { ${Class}Input } from './${mod}.schema';
import ${Class}Model from './${mod}.model';

const create${Class} = async (payload: ${Class}Input) => {
  const created = await ${Class}Model.create(payload);
  return created;
};

export const ${varName}Service = {
  create${Class},
};
`,

  model: (mod: string, Class: string, varName: string) => `import { Schema, model } from 'mongoose';
import { ${Class}Input } from './${mod}.schema';

const ${varName}Schema = new Schema<${Class}Input>({
  name: { type: String, required: true },
}, { timestamps: true });

const ${Class}Model = model<${Class}Input>('${Class}', ${varName}Schema);
export default ${Class}Model;
`,

  schema: (_: string, Class: string, varName: string) => `import { z } from 'zod';

export const create${Class} = z.object({
  body: z.object({
    name: z.string({ required_error: '${Class} name is required' }),
  }),
});

// Add other schemas here as needed
// export const update${Class} = z.object({...});

export const ${varName}Schema = {
  create${Class},
  // update${Class},
};

// Type export for mongoose schema
export type ${Class}Input = z.infer<typeof create${Class}>['body'];
`,

  route: (mod: string, Class: string, varName: string) => `import { Router } from 'express';
import { ${varName}Handler } from './${mod}.controller';
import validateRequest from '@/app/middlewares/validateRequest';
import { ${varName}Schema } from './${mod}.schema';
import { defineRoutes } from '@/utils/defineRoutes';

const ${varName}Router = Router();

defineRoutes(${varName}Router, [
  {
    method: 'post',
    path: '/create',
    middlewares: [validateRequest(${varName}Schema.create${Class})],
    handler: ${varName}Handler,
  },
  // add other routes as needed
]);

export default ${varName}Router;
`,

  constant: (_: string, Class: string) => `export const ${Class.toUpperCase()}_MESSAGES = {
  SUCCESS: '${Class} operation successful',
  FAILED: '${Class} operation failed',
};
`,
};

// Main Generator Function
const createModule = (name: string) => {
  const mod = name.toLowerCase();
  const Class = capitalize(mod);
  const varName = camel(mod);
  const basePath = path.join(__dirname, '../app/modules', mod);

  const files: Record<string, string> = {
    controller: `${mod}.controller.ts`,
    service: `${mod}.service.ts`,
    model: `${mod}.model.ts`,
    schema: `${mod}.schema.ts`,
    route: `${mod}.route.ts`,
    constant: `${mod}.constant.ts`,
  };

  // Create module folder if not exists
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

  // Create files
  Object.entries(files).forEach(([type, filename]) => {
    const filePath = path.join(basePath, filename);
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ File already exists: ${filePath}`);
      return;
    }

    const templateFunc = templates[type as keyof typeof templates];
    const content = templateFunc(mod, Class, varName);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${filePath}`);
  });
};

// Run CLI
const name = process.argv[2];
if (!name) {
  console.error('❌ Please provide a module name. Example: yarn create-module user');
  process.exit(1);
}

createModule(name);
