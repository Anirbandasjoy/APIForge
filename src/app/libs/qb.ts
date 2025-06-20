import { Model, Query, PopulateOptions, FilterQuery, Document } from 'mongoose';

type Keys<T> = T extends object ? Extract<keyof T, string> : never;

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<Lean = Record<string, unknown>> {
  meta: PaginationMeta;
  data: Lean[];
}

class QueryBuilder<Doc extends Document = Document, Lean = Doc> {
  private model: Model<Doc>;
  private query: Query<Doc[], Doc>;
  private page = 1;
  private limit = 10;

  constructor(model: Model<Doc>) {
    this.model = model;
    this.query = model.find();
  }

  search(term?: unknown, fields: Keys<Doc>[] = []) {
    if (!term || !fields.length) return this;
    let text: string;
    if (Array.isArray(term)) {
      text = term.map(String).join(' ');
    } else {
      text = String(term);
    }
    const regex = new RegExp(text, 'i');
    const $or = fields.map((field) => ({ [field]: regex }));
    this.query = this.query.find({ $or } as FilterQuery<Doc>);
    return this;
  }

  filter(filters: Partial<Record<Keys<Doc>, unknown>>) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (Array.isArray(val)) {
        const values = val.map(String);
        this.query = this.query.find({ [key]: { $in: values } } as FilterQuery<Doc>);
      } else {
        this.query = this.query.find({ [key]: String(val) } as FilterQuery<Doc>);
      }
    });
    return this;
  }

  sort(sortBy?: unknown) {
    if (!sortBy) return this;
    const sortStr = typeof sortBy === 'string' ? sortBy.split(',').join(' ') : String(sortBy);
    this.query = this.query.sort(sortStr);
    return this;
  }

  select(fields?: string | string[]) {
    if (!fields) return this;
    const f = Array.isArray(fields) ? fields.join(' ') : fields.split(',').join(' ');
    this.query = this.query.select(f);
    return this;
  }

  populate(populate?: string | PopulateOptions | (string | PopulateOptions)[]) {
    if (!populate) return this;
    const handle = (p: string | PopulateOptions) =>
      (this.query =
        typeof p === 'string' ? this.query.populate({ path: p }) : this.query.populate(p));
    Array.isArray(populate) ? populate.forEach(handle) : handle(populate);
    return this;
  }

  paginate(page?: unknown, limit?: unknown) {
    let p = 1;
    let l = 10;
    if (page !== undefined && page !== null) {
      p = typeof page === 'string' ? parseInt(page, 10) : Number(page);
      if (isNaN(p) || p < 1) p = 1;
    }
    if (limit !== undefined && limit !== null) {
      l = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
      if (isNaN(l) || l < 1) l = 10;
    }
    this.page = p;
    this.limit = l;
    const skip = (this.page - 1) * this.limit;
    this.query = this.query.skip(skip).limit(this.limit);
    return this;
  }

  async exec(): Promise<PaginatedResponse<Lean>> {
    const filter = this.query.getFilter() as FilterQuery<Doc>;
    const total = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(total / this.limit);
    const data = (await this.query.lean().exec()) as Lean[];
    const meta: PaginationMeta = {
      total,
      page: this.page,
      limit: this.limit,
      totalPages,
      hasNextPage: this.page < totalPages,
      hasPrevPage: this.page > 1,
      nextPage: this.page < totalPages ? this.page + 1 : null,
      prevPage: this.page > 1 ? this.page - 1 : null,
    };
    return { meta, data };
  }
}

export function qb<Doc extends Document>(model: Model<Doc>) {
  return new QueryBuilder<Doc, Record<string, unknown>>(model);
}
