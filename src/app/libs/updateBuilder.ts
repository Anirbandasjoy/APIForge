import {
  Model,
  FilterQuery,
  UpdateQuery,
  Document,
  ClientSession,
  UpdateWriteOpResult,
  QueryOptions,
} from 'mongoose';
import { BadRequestError, NotFoundError } from '../errors/apiError';

type SafeQueryOptions = Omit<QueryOptions, 'session'> & {
  session?: ClientSession;
};

export interface UpdateResult<T> {
  matched: number;
  modified: number;
  data?: T | null;
}

export class UpdateBuilder<T extends Document> {
  private whitelist: (keyof T)[] = [];

  constructor(private readonly model: Model<T>) {}

  /** Allow only specific fields to be updated */
  allow<K extends keyof T>(...fields: K[]) {
    this.whitelist = fields;
    return this;
  }

  /** Filter out non-allowed fields */
  private sanitize(payload: UpdateQuery<T>): UpdateQuery<T> {
    if (!this.whitelist.length) return payload;

    const safe = Object.fromEntries(
      Object.entries(payload).filter(([k]) => this.whitelist.includes(k as keyof T))
    ) as UpdateQuery<T>;

    if (Object.keys(safe).length === 0) {
      throw BadRequestError('No valid fields to update');
    }

    return safe;
  }

  /** ---------- updateById ---------- */
  async updateById(
    id: string,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = { new: true }
  ): Promise<UpdateResult<T>> {
    if (!id) throw BadRequestError('ID is required for update');

    const doc = await this.model.findByIdAndUpdate(id, this.sanitize(payload), {
      ...options,
      runValidators: true,
    });

    if (!doc) throw NotFoundError('Document not found');

    return { matched: 1, modified: 1, data: doc };
  }

  /** ---------- updateOne ---------- */
  async updateOne(
    filter: FilterQuery<T>,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = { new: true }
  ): Promise<UpdateResult<T>> {
    const doc = await this.model.findOneAndUpdate(filter, this.sanitize(payload), {
      ...options,
      runValidators: true,
    });

    if (!doc) throw NotFoundError('Document not found');

    return { matched: 1, modified: 1, data: doc };
  }

  /** ---------- updateMany ---------- */
  async updateMany(
    filter: FilterQuery<T>,
    payload: UpdateQuery<T>,
    options: SafeQueryOptions = {}
  ): Promise<UpdateWriteOpResult> {
    const result = await this.model.updateMany(filter, this.sanitize(payload), {
      ...options,
      runValidators: true,
    });

    if (result.matchedCount === 0) {
      throw NotFoundError('No documents matched the filter');
    }

    return result;
  }
}

export function ub<Doc extends Document>(model: Model<Doc>, ...allowed: (keyof Doc)[]) {
  return new UpdateBuilder<Doc>(model).allow(...allowed);
}
