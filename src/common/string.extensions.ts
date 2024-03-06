import { Types } from 'mongoose';
declare global {
  interface String {
    toBoolean(): boolean;
    toObjectId(): Types.ObjectId;
  }
}

String.prototype.toBoolean = function () {
  const value = this.toString().toLowerCase();
  return value === 'true' || value == '1';
};

String.prototype.toObjectId = function () {
  const value = String(this.toString());
  return new Types.ObjectId(value);
};
