/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Model, FilterQuery } from 'mongoose';
import 'moment-timezone';
import { isString } from 'class-validator';
import { CriteriaDto } from './criteria.dto';

@Injectable()
export abstract class GenericService<U, T extends Document> {
  constructor(readonly model: Model<T>) {}

  async create(
    input: T,
    session: mongoose.ClientSession | null = null,
  ): Promise<T> {
    if (!Array.isArray(input)) {
      input._id = new mongoose.Types.ObjectId();
      const result = new this.model(input);
      await result.save({ session });
      return result;
    } else {
      let inputObj = input as unknown;
      inputObj = input.map((m) => {
        m._id = new mongoose.Types.ObjectId();
        return m;
      });
      const result = await this.model.create(inputObj, { session });
      return result as any;
    }
  }

  async createMany(
    input: Array<T>,
    session: mongoose.ClientSession | null = null,
  ): Promise<any> {
    const inputObj = input.map((m) => {
      m._id = new mongoose.Types.ObjectId();
      return m;
    });
    const result = await this.model.insertMany(inputObj, { session });
    return result as any;
  }

  sanitize(input: object = {}) {
    const object_in = input;
    for (const [key, value] of Object.entries(object_in)) {
      if (value === 'true') object_in[key] = true;
      if (value === 'false') object_in[key] = false;
      if (key === '$size') object_in[key] = parseInt(value);
      if (typeof value === 'object' && value !== null) {
        object_in[key] = this.sanitize(value);
      }
    }
    return object_in;
  }

  async findAll(criteria: CriteriaDto, lean = false): Promise<Array<T>> {
    const {
      filter = '{}',
      skip = 0,
      limit = 150,
      sort,
      populate,
      select,
      populate_string = null,
    } = criteria;
    let jsonCriteria = isString(filter) ? JSON.parse(filter as string) : filter;
    jsonCriteria = this.sanitize(jsonCriteria);
    const required_filter = [
      { deleted: { $exists: false } },
      { deleted: false },
    ];
    if (!jsonCriteria.$or) {
      jsonCriteria = {
        $or: required_filter,
        ...jsonCriteria,
      };
    } else {
      jsonCriteria = {
        $and: [{ $or: required_filter }, { ...jsonCriteria }],
      };
    }

    const cmd = this.model
      .find(jsonCriteria as FilterQuery<T>)
      .skip(+limit == 1 ? null : +skip)
      .limit(+limit);
    if (select) cmd.select(select);
    if (sort) cmd.sort(sort);
    if (populate) cmd.populate(populate.split(','));
    if (populate_string) cmd.populate(JSON.parse(populate_string));
    if (lean) return await cmd.lean().exec() as Array<T>;
    return await cmd.exec();
  }

  async findOne(criteria: CriteriaDto, lean = false): Promise<T | null> {
    const {
      filter = '{}',
      populate,
      select,
      populate_string = null,
    } = criteria;
    let jsonCriteria = isString(filter) ? JSON.parse(filter as string) : filter;
    jsonCriteria = this.sanitize(jsonCriteria);
    const required_filter = [
      { deleted: { $exists: false } },
      { deleted: false },
    ];
    if (!jsonCriteria.$or)
      jsonCriteria = {
        $or: required_filter,
        ...jsonCriteria,
      };
    else {
      jsonCriteria = {
        $and: [{ $or: required_filter }, { $or: jsonCriteria.$or }],
      };
    }
    const cmd = this.model.findOne(jsonCriteria as FilterQuery<T>);
    if (populate) cmd.populate(populate.split(','));
    if (populate_string) cmd.populate(JSON.parse(populate_string));
    if (select) cmd.select(select);
    if (lean) return await cmd.lean().exec() as T;
    return await cmd.exec();
  }

  async findById(
    id: string,
    select?: string,
    populate?: string,
    populate_string?: any,
    lean = false,
  ): Promise<T | null> {
    const cmd = this.model.findById(id);
    if (populate) cmd.populate(populate.split(','));
    if (select) cmd.select(select);
    if (populate_string) cmd.populate(JSON.parse(populate_string as string));
    if (lean) return await cmd.lean().exec() as T;
    return await cmd.exec();
  }

  async findOneAndUpdate(
    criteria: CriteriaDto,
    session: mongoose.ClientSession | null = null,
    upsert = true,
  ): Promise<T | null> {
    const filter = {
      ...criteria.filter,
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    };
    return this.model
      .findOneAndUpdate(filter, criteria.patch_obj, {
        new: upsert,
        upsert: upsert,
      })
      .session(session);
  }

  async count(criteria: CriteriaDto) {
    const { filter = '{}' } = criteria;
    let jsonCriteria = isString(filter) ? JSON.parse(filter as string) : filter;
    jsonCriteria = this.sanitize(jsonCriteria);
    const required_filter = [
      { deleted: { $exists: false } },
      { deleted: false },
    ];
    jsonCriteria = {
      ...(jsonCriteria.$or && {
        $or: [...jsonCriteria.$or, ...required_filter],
      }),
      $or: required_filter,
      ...jsonCriteria,
    };
    const cmd = this.model.countDocuments(jsonCriteria as FilterQuery<T>);
    return await cmd.exec();
  }

  async update(
    id: string | ObjectId,
    input: U,
    session: mongoose.ClientSession | null = null,
  ): Promise<U> {
    let obj: U = input;
    obj = this.deleteProperty(obj, '_id');
    return this.model
      .findOneAndUpdate<U>(
        { _id: id, $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        obj,
        {
          new: true,
          upsert: true,
          session,
        },
      )
      .exec();
  }

  async findAndUpdate(
    criteria: CriteriaDto,
    session: mongoose.ClientSession | null = null,
    upsert = true,
  ): Promise<any> {
    const filter = {
      ...criteria.filter,
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    };
    return this.model
      .updateMany(filter, criteria.patch_obj, {
        multi: true,
        upsert: upsert,
      })
      .session(session);
  }

  async delete(id: string): Promise<U> {
    await this.model.findOneAndUpdate<U>({ _id: id }, { deleted: true }).exec();
    return await this.model.findOne<U>({ _id: id }).exec();
  }

  async deleteByCriteria(criteria: CriteriaDto): Promise<Array<U>> {
    await this.model.updateMany<U>(criteria.filter, { deleted: true }).exec();
    return await this.model.find<U>(criteria.filter).exec();
  }

  async findAndHardDelete(
    criteria: CriteriaDto,
    session: mongoose.ClientSession | null = null,
  ): Promise<any> {
    return this.model.deleteMany(criteria.filter).session(session);
  }

  async aggregate(criteria: CriteriaDto): Promise<Array<any>> {
    const { aggregation = [] } = criteria;
    return await this.model.aggregate(aggregation).exec();
  }

  deleteProperty(obj: U, deletedKey: string) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === deletedKey) {
        delete obj[key];
      }
    }
    return obj;
  }
}
