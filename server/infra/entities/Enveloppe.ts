import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Allocation } from "./Allocation";
import { ALLOCATIONS, ENVELOPPES_TABLE } from "./EnveloppeSQL";

export type CreateEnveloppeParams = {};

@Entity({ name: ENVELOPPES_TABLE })
@Tree("closure-table")
export class Enveloppe {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  balance!: number;

  static create(): Enveloppe {
    const env = new Enveloppe();
    return env;
  }

  @OneToMany(() => Allocation, (a) => a.enveloppe)
  [ALLOCATIONS]!: Allocation[];

  @TreeChildren({ cascade: true })
  children?: Enveloppe[];

  @TreeParent()
  parent!: Enveloppe;
}
