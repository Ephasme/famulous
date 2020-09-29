import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { AllocationDao } from "../Allocation";

export const ALLOCATIONS = "allocations";
export const ENVELOPPES_TABLE = "enveloppes";

export type CreateEnveloppeParams = {};

@Entity({ name: ENVELOPPES_TABLE })
@Tree("closure-table")
export class EnveloppeDao {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  balance!: number;

  static create(): EnveloppeDao {
    const env = new EnveloppeDao();
    return env;
  }

  @OneToMany(() => AllocationDao, (a) => a.enveloppe)
  [ALLOCATIONS]!: AllocationDao[];

  @TreeChildren({ cascade: true })
  children?: EnveloppeDao[];

  @TreeParent()
  parent!: EnveloppeDao;
}
