import fs from 'fs';
import path from 'path';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const camel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const createModule = (name: string) => {
  const mod = name.toLowerCase();
  const Class = capitalize(mod);
  const varName = camel(mod);
  const base = path.join(__dirname, '../app/modules', mod);

  const files = [
    `${mod}.controller.ts`,
    `${mod}.service.ts`,
    `${mod}.model.ts`,
    `${mod}.schema.ts`,
    `${mod}.route.ts`,
    `${mod}.constant.ts`,
  ];

  if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

  files.forEach((file) => {
    const filePath = path.join(base, file);
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ File already exists: ${file}`);
      return;
    }

    let content = '';

    // Controller
    if (file.endsWith('.controller.ts')) {
      content = `import catchAsync from '@/utils/catchAsync';\nimport { ${varName}Service } from './${mod}.service';\nimport { sendSuccessResponse } from '@/utils/response';\nimport { StatusCodes } from 'http-status-codes';\n\nexport const ${varName}Handler = catchAsync(async (req, res) => {\n  const data = await ${varName}Service.doSomething(req.body);\n  sendSuccessResponse(res, {\n    statusCode: StatusCodes.OK,\n    message: '${Class} request processed',\n    data,\n  });\n});\n`;
    }

    // Service
    else if (file.endsWith('.service.ts')) {
      content = `import { ${Class}Input } from './${mod}.schema';\nimport ${Class}Model from './${mod}.model';\n\nexport const ${varName}Service = {\n  async doSomething(payload: ${Class}Input) {\n    const created = await ${Class}Model.create(payload);\n    return created;\n  },\n};\n`;
    }

    // Model
    else if (file.endsWith('.model.ts')) {
      content = `import { Schema, model } from 'mongoose';\nimport { ${Class}Input } from './${mod}.schema';\n\nconst ${varName}Schema = new Schema<${Class}Input>({\n  name: { type: String, required: true },\n}, { timestamps: true });\n\nconst ${Class}Model = model('${Class}', ${varName}Schema);\nexport default ${Class}Model;\n`;
    }

    // Schema
    else if (file.endsWith('.schema.ts')) {
      content = `import { z } from 'zod';\n\nexport const ${varName}Schema = z.object({\n  body: z.object({\n    name: z.string({ required_error: '${Class} name is required' }),\n  }),\n});\n\nexport type ${Class}Input = z.infer<typeof ${varName}Schema>['body'];\n`;
    }

    // Route
    else if (file.endsWith('.route.ts')) {
      content = `import { Router } from 'express';\nimport { ${varName}Handler } from './${mod}.controller';\nimport validateRequest from '@/app/middlewares/validateRequest';\nimport { ${varName}Schema } from './${mod}.schema';\n\nconst ${varName}Router = Router();\n\n${varName}Router.post('/', validateRequest(${varName}Schema), ${varName}Handler);\n\nexport default ${varName}Router;\n`;
    }

    // Constant
    else if (file.endsWith('.constant.ts')) {
      content = `export const ${Class.toUpperCase()}_MESSAGES = {\n  SUCCESS: '${Class} operation successful',\n  FAILED: '${Class} operation failed',\n};\n`;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${filePath}`);
  });
};

// Run script
const name = process.argv[2];
if (!name) {
  console.error('❌ Please provide a module name. Example: yarn create-module user');
  process.exit(1);
}
createModule(name);
