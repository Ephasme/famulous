import { AnyDomainType, AnyState, AnyEntity } from ".";

export interface Repository {
  fetchOne(domainType: AnyDomainType, id?: string): Promise<AnyState>;
  saveAll(...entity: AnyEntity[]): Promise<void>;
}
