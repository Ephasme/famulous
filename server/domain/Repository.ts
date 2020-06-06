import { AnyDomainType, AnyState, AnyEntity } from ".";

export interface Repository {
  fetchOne(domainType: AnyDomainType, id?: string): Promise<AnyState>;
  save<T extends AnyEntity>(entity: T): Promise<string>;
}
