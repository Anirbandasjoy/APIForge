import { Model, FilterQuery, Query, InferSchemaType } from 'mongoose';

interface QueryOptions<T> {
  searchFields?: (keyof T)[];
  filterFields?: (keyof T)[];
  defaultSort?: string;
  populate?: string | string[];
}

interface QueryParams {
  search?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

interface PaginatedResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  data: T[];
}

export const getDocuments = async <T>(
  model: Model<T>,
  queryParams: QueryParams,
  options: QueryOptions<T> = {}
): Promise<PaginatedResponse<InferSchemaType<Model<T>>>> => {
  const { searchFields = [], filterFields = [], defaultSort = '-createdAt', populate } = options;

  const { search, sort, fields, page = '1', limit = '10', ...rest } = queryParams;

  // Parse and validate pagination parameters
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  // Build search query
  const searchQuery: FilterQuery<T> = {};
  if (search && searchFields.length > 0) {
    searchQuery.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })) as any;
  }

  // Build filter query
  const filterQuery: FilterQuery<T> = {} as FilterQuery<T>;
  for (const field of filterFields) {
    const value = rest[field as string];
    if (value !== undefined) {
      (filterQuery as any)[field] = value;
    }
  }

  // Combine final query
  const finalQuery: FilterQuery<T> = {
    ...searchQuery,
    ...filterQuery,
  } as FilterQuery<T>;

  // Create base query
  let query: Query<InferSchemaType<Model<T>>[], InferSchemaType<Model<T>>> = model.find(finalQuery);

  // Apply sorting
  const sortString = sort ? sort.split(',').join(' ') : defaultSort;
  query = query.sort(sortString);

  // Apply field selection
  if (fields) {
    const selectedFields = fields.split(',').join(' ');
    query = query.select(selectedFields);
  }

  // Apply population
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((path) => {
        query = query.populate(path);
      });
    } else {
      query = query.populate(populate);
    }
  }

  // Count total documents before pagination
  const total = await model.countDocuments(finalQuery).exec();
  const totalPages = Math.ceil(total / limitNum);

  // Apply pagination
  query = query.skip(skip).limit(limitNum);

  // Get lean results
  const data: InferSchemaType<Model<T>>[] = await query.lean().exec();

  // Calculate pagination metadata
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;
  const nextPage = hasNextPage ? pageNum + 1 : null;
  const prevPage = hasPrevPage ? pageNum - 1 : null;

  return {
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    },
    data,
  };
};

export const getDocumentById = async <T>(
  model: Model<T>,
  id: string,
  options: QueryOptions<T> = {}
): Promise<InferSchemaType<Model<T>>> => {
  const { populate } = options;

  let query: Query<InferSchemaType<Model<T>>, InferSchemaType<Model<T>>> = model.findById(id);

  if (!query) {
    throw new Error(`Document with ID ${id} not found`);
  }
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((path) => {
        query = query.populate(path);
      });
    } else {
      query = query.populate(populate);
    }
  }

  const document = await query.lean().exec();
  if (!document) {
    throw new Error(`Document with ID ${id} not found`);
  }

  return document;
};

export const createDocument = async <T>(
  model: Model<T>,
  data: Partial<InferSchemaType<Model<T>>>
): Promise<InferSchemaType<Model<T>>> => {
  const document = new model(data);
  const savedDocument = await document.save();
  return savedDocument.toObject();
};

export const updateDocument = async <T>(
  model: Model<T>,
  id: string,
  data: Partial<InferSchemaType<Model<T>>>
): Promise<InferSchemaType<Model<T>>> => {
  const updatedDocument = await model.findByIdAndUpdate(id, data, { new: true }).lean().exec();

  if (!updatedDocument) {
    throw new Error(`Document with ID ${id} not found`);
  }

  return updatedDocument;
};

export const deleteDocument = async <T>(
  model: Model<T>,
  id: string
): Promise<InferSchemaType<Model<T>>> => {
  const deletedDocument = await model.findByIdAndDelete(id).lean().exec();

  if (!deletedDocument) {
    throw new Error(`Document with ID ${id} not found`);
  }

  return deletedDocument;
};

export const deleteManyDocuments = async <T>(
  model: Model<T>,
  ids: string[]
): Promise<{ deletedCount: number }> => {
  const result = await model.deleteMany({ _id: { $in: ids } });
  return { deletedCount: result.deletedCount };
};

export const deleteAllDocuments = async <T>(model: Model<T>): Promise<{ deletedCount: number }> => {
  const result = await model.deleteMany({});
  return { deletedCount: result.deletedCount };
};

export const countDocuments = async <T>(
  model: Model<T>,
  query: FilterQuery<T> = {}
): Promise<number> => {
  return model.countDocuments(query).exec();
};

export const existsDocument = async <T>(
  model: Model<T>,
  query: FilterQuery<T>
): Promise<boolean> => {
  const count = await model.countDocuments(query).exec();
  return count > 0;
};

export const aggregateDocuments = async <T>(
  model: Model<T>,
  pipeline: any[]
): Promise<InferSchemaType<Model<T>>[]> => {
  return model.aggregate(pipeline).exec();
};

export const distinctDocuments = async <T>(
  model: Model<T>,
  field: keyof T,
  query: FilterQuery<T> = {}
): Promise<any[]> => {
  return model.distinct(field as string, query).exec();
};

export const findOneDocument = async <T>(
  model: Model<T>,
  query: FilterQuery<T>,
  options: QueryOptions<T> = {}
): Promise<InferSchemaType<Model<T>> | null> => {
  const { populate } = options;

  let dbQuery: Query<InferSchemaType<Model<T>>, InferSchemaType<Model<T>>> = model.findOne(query);

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((path) => {
        dbQuery = dbQuery.populate(path);
      });
    } else {
      dbQuery = dbQuery.populate(populate);
    }
  }

  return dbQuery.lean().exec();
};

export const findByIdAndUpdateDocument = async <T>(
  model: Model<T>,
  id: string,
  update: Partial<InferSchemaType<Model<T>>>,
  options: { new?: boolean; upsert?: boolean } = {}
): Promise<InferSchemaType<Model<T>> | null> => {
  return model
    .findByIdAndUpdate(id, update, { new: options.new, upsert: options.upsert })
    .lean()
    .exec();
};

export const findByIdAndDeleteDocument = async <T>(
  model: Model<T>,
  id: string
): Promise<InferSchemaType<Model<T>> | null> => {
  return model.findByIdAndDelete(id).lean().exec();
};

export const findByIdAndUpdateWithOptions = async <T>(
  model: Model<T>,
  id: string,
  update: Partial<InferSchemaType<Model<T>>>,
  options: { new?: boolean; upsert?: boolean } = {}
): Promise<InferSchemaType<Model<T>> | null> => {
  return model
    .findByIdAndUpdate(id, update, { new: options.new, upsert: options.upsert })
    .lean()
    .exec();
};

export const findByIdAndDeleteWithOptions = async <T>(
  model: Model<T>,
  id: string
): Promise<InferSchemaType<Model<T>> | null> => {
  return model.findByIdAndDelete(id).lean().exec();
};

export const findByIdAndUpdateWithPopulate = async <T>(
  model: Model<T>,
  id: string,
  update: Partial<InferSchemaType<Model<T>>>,
  populate: string | string[] = ''
): Promise<InferSchemaType<Model<T>> | null> => {
  let query: Query<InferSchemaType<Model<T>>, InferSchemaType<Model<T>>> = model.findByIdAndUpdate(
    id,
    update,
    { new: true }
  );

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((path) => {
        query = query.populate(path);
      });
    } else {
      query = query.populate(populate);
    }
  }

  return query.lean().exec();
};
