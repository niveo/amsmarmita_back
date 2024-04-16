import { Request } from 'express';
import { Document } from 'mongoose';

export const cloneMongoDocument = (doc: Document) => {
  const obj = doc.toObject();
  delete obj._id;
  delete obj['__v'];
  return obj;
};

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
