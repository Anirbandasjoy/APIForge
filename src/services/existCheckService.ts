import { Document, Model } from 'mongoose';

export async function exists<T extends Document>(
  model: Model<T>,
  filter: Partial<Record<keyof T, any>>
): Promise<boolean> {
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithId<T extends Document>(
  model: Model<T>,
  id: string
): Promise<boolean> {
  const found = await model.exists({ _id: id });
  return !!found;
}

export async function existsWithEmail<T extends Document>(
  model: Model<T>,
  email: string
): Promise<boolean> {
  const found = await model.exists({ email });
  return !!found;
}

export async function existsWithUsername<T extends Document>(
  model: Model<T>,
  username: string
): Promise<boolean> {
  const found = await model.exists({ username });
  return !!found;
}

export async function existsWithPhone<T extends Document>(
  model: Model<T>,
  phone: string
): Promise<boolean> {
  const found = await model.exists({ phone });
  return !!found;
}

export async function existsWithSlug<T extends Document>(
  model: Model<T>,
  slug: string
): Promise<boolean> {
  const found = await model.exists({ slug });
  return !!found;
}

export async function existsWithField<T extends Document>(
  model: Model<T>,
  field: keyof T,
  value: any
): Promise<boolean> {
  const filter = { [field]: value } as Partial<Record<keyof T, any>>;
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithFields<T extends Document>(
  model: Model<T>,
  fields: Partial<Record<keyof T, any>>
): Promise<boolean> {
  const found = await model.exists(fields);
  return !!found;
}

export async function existsWithMultipleFields<T extends Document>(
  model: Model<T>,
  fields: Partial<Record<keyof T, any>>
): Promise<boolean> {
  const found = await model.exists(fields);
  return !!found;
}

export async function existsWithMultipleValues<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $in: values } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithRegex<T extends Document>(
  model: Model<T>,
  field: keyof T,
  regex: RegExp
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: regex };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithDateRange<T extends Document>(
  model: Model<T>,
  field: keyof T,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  const filter: Record<string, any> = {
    [field]: { $gte: startDate, $lte: endDate },
  };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithNestedField<T extends Document>(
  model: Model<T>,
  nestedField: string,
  value: any
): Promise<boolean> {
  const filter: Partial<Record<string, any>> = {};
  filter[nestedField] = value;
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithNestedFields<T extends Document>(
  model: Model<T>,
  nestedFields: Partial<Record<string, any>>
): Promise<boolean> {
  const found = await model.exists(nestedFields);
  return !!found;
}

export async function existsWithArrayField<T extends Document>(
  model: Model<T>,
  field: keyof T,
  value: any
): Promise<boolean> {
  const filter = { [field]: value } as Partial<Record<keyof T, any>>;
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldContains<T extends Document>(
  model: Model<T>,
  field: keyof T,
  value: any
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $in: [value] } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldSize<T extends Document>(
  model: Model<T>,
  field: keyof T,
  size: number
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $size: size } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldLength<T extends Document>(
  model: Model<T>,
  field: keyof T,
  length: number
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $size: length } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldIncludes<T extends Document>(
  model: Model<T>,
  field: keyof T,
  value: any
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $in: [value] } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldExcludes<T extends Document>(
  model: Model<T>,
  field: keyof T,
  value: any
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $nin: [value] } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldAll<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter = { [field]: { $all: values } } as Partial<Record<keyof T, any>>;
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldAny<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $in: values } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldNone<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $nin: values } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldSizeRange<T extends Document>(
  model: Model<T>,
  field: keyof T,
  minSize: number,
  maxSize: number
): Promise<boolean> {
  const filter: Record<string, any> = {
    [field]: { $size: { $gte: minSize, $lte: maxSize } },
  };
  const found = await model.exists(filter);
  return !!found;
}
export async function existsWithArrayFieldContainsAll<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $all: values } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldContainsAny<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $in: values } };
  const found = await model.exists(filter);
  return !!found;
}

export async function existsWithArrayFieldContainsNone<T extends Document>(
  model: Model<T>,
  field: keyof T,
  values: any[]
): Promise<boolean> {
  const filter: Record<string, any> = { [field]: { $nin: values } };
  const found = await model.exists(filter);
  return !!found;
}
