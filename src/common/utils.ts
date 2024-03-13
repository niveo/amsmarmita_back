import { Document } from 'mongoose';

export const cloneMongoDocument = (doc: Document) => {
  const obj = doc.toObject();
  delete obj._id;
  delete obj['__v'];
  return obj;
};
