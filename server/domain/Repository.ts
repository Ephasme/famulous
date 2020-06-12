import { AnyDomainType, AnyState, AnyEntity } from ".";

export interface FindParameters {
  [key: string]: string | number;
}

export interface Repository {
  fetchOne(domainType: AnyDomainType, id?: string): Promise<AnyState>;
  saveAll(...entity: AnyEntity[]): Promise<void>;
  find(
    domainType: AnyDomainType,
    parameters: FindParameters
  ): Promise<AnyState[]>;
}
