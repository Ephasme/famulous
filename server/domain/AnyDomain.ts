import { UserType } from "./user/states/UserState";
import { AccountType } from "./account/states/AccountState";

export type AnyDomainType = AccountType | UserType;
