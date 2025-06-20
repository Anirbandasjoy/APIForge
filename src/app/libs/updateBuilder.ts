import {
  Model,
  FilterQuery,
  UpdateQuery,
  Document,
  ClientSession,
  UpdateWriteOpResult,
  QueryOptions,
} from 'mongoose';

type SafeQueryOptions = Omit<QueryOptions, 'session'> & { session?: ClientSession };

interface UpdateResult<T> {
  matched: number;
  modified: number;
  data?: T | null;
}

export class UpdateBuilder<T extends Document> {
  private whitelist: (keyof T)[] = [];

  constructor(private readonly model: Model<T>) {}

  allow<K extends keyof T>(...fields: K[]) {
    this.whitelist = fields;
    return this;
  }

  private sanitize(payload: UpdateQuery<T>): UpdateQuery<T> {
    if (!this.whitelist.length) return payload;
    return Object.fromEntries(
      Object.entries(payload).filter(([k]) => this.whitelist.includes(k as keyof T))
    ) as UpdateQuery<T>;
  }

  /** ---------- updateById ---------- */
  async updateById(
    id: string,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = { new: true }
  ): Promise<UpdateResult<T>> {
    const safePayload = this.sanitize(payload);
    const doc = await this.model.findByIdAndUpdate(id, safePayload, {
      ...options,
      runValidators: true,
    });
    return { matched: doc ? 1 : 0, modified: doc ? 1 : 0, data: doc };
  }

  /** ---------- updateOne ---------- */
  async updateOne(
    filter: FilterQuery<T>,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = { new: true }
  ): Promise<UpdateResult<T>> {
    const safePayload = this.sanitize(payload);
    const doc = await this.model.findOneAndUpdate(filter, safePayload, {
      ...options,
      runValidators: true,
    });
    return { matched: doc ? 1 : 0, modified: doc ? 1 : 0, data: doc };
  }

  /** ---------- updateMany ---------- */
  async updateMany(
    filter: FilterQuery<T>,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = {}
  ): Promise<UpdateWriteOpResult> {
    const safePayload = this.sanitize(payload);
    return this.model.updateMany(filter, safePayload, {
      ...options,
      runValidators: true,
    });
  }
}
