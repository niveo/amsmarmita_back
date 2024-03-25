import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import '../../common/prototype.extensions';

let mongod: MongoMemoryReplSet;

/**
 * @param options
 * @returns
 * Teste com transação só funciona com MongoMemoryReplSet
 */
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryReplSet.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        //useCreateIndex: true,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
