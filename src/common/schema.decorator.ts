import * as mongoose from 'mongoose';
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';
import * as _ from 'lodash';

export type SchemaOptions = mongoose.SchemaOptions & {
  inheritOption?: boolean;
};

function mergeOptions(
  parentOptions: SchemaOptions,
  childOptions: SchemaOptions,
): SchemaOptions {
  for (const key in childOptions) {
    if (Object.prototype.hasOwnProperty.call(childOptions, key)) {
      parentOptions[key] = childOptions[key];
    }
  }
  return parentOptions;
}

export function Schema(options?: SchemaOptions): ClassDecorator {
  return (target) => {
    const isInheritOptions = options?.inheritOption;

    if (isInheritOptions) {
      const parentSchemaMetadata =
        TypeMetadataStorage.getSchemaMetadataByTarget(
          (target as any).__proto__,
        );

      if (!parentSchemaMetadata || !parentSchemaMetadata.options) {
        throw new Error(
          `Cannot inherit schema options: parent metadata for ${target.name} is undefined.`,
        );
      }

      const parentOptions = _.cloneDeep(parentSchemaMetadata.options);
      options = mergeOptions(parentOptions, options || {});
    }

    TypeMetadataStorage.addSchemaMetadata({
      target,
      options,
    });
  };
}
