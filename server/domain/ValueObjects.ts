import Joi = require("@hapi/joi");
import { TRANSACTION } from ".";
import { ACCOUNT } from "./account/AccountModel";
import * as uuid from "uuid";
import { USER } from "./user/UserModel";

export const ENVELOPPE = "enveloppe";
export const ALLOCATION = "allocation";

export type ValueObject<T, TNAME> = {
  readonly name: TNAME;
  readonly value: T;
};

export type TransactionId = ValueObject<string, typeof TRANSACTION>;
export type AccountId = ValueObject<string, typeof ACCOUNT>;
export type EnveloppeId = ValueObject<string, typeof ENVELOPPE>;
export type AllocationId = ValueObject<string, typeof ALLOCATION>;
export type UserId = ValueObject<string, typeof USER>;

export type AnyId =
  | TransactionId
  | AccountId
  | EnveloppeId
  | AllocationId
  | UserId;

const validateUuid = (value: unknown): value is string => {
  const { error } = Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .validate(value);
  if (error) {
    throw error;
  }
  return true;
};

function Uuid<TNAME>(name: TNAME, value?: string): ValueObject<string, TNAME> {
  if (value) {
    validateUuid(value);
  }
  return { value: value || uuid.v4(), name };
}
export const UserId = (value?: string): UserId =>
  Uuid<typeof USER>(USER, value);

export const AccountId = (value?: string): AccountId =>
  Uuid<typeof ACCOUNT>(ACCOUNT, value);

export const TransactionId = (value?: string): TransactionId =>
  Uuid<typeof TRANSACTION>(TRANSACTION, value);

export const EnveloppeId = (value?: string): EnveloppeId =>
  Uuid<typeof ENVELOPPE>(ENVELOPPE, value);

export const AllocationId = (value?: string): AllocationId =>
  Uuid<typeof ALLOCATION>(ALLOCATION, value);
