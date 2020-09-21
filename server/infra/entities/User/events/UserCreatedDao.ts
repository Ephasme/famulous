import { Column, Entity } from "typeorm";
import { UserCreated } from "../../../../domain";
import { BaseEventDao } from "../../BaseEventDao";

@Entity({ name: "event_user_created" })
export class UserCreatedDao extends BaseEventDao {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  static from(event: UserCreated): UserCreatedDao {
    const { email, password, salt } = event.payload;
    const dao = this.mapEventToDao(event, new UserCreatedDao());
    dao.email = email;
    dao.password = password;
    dao.salt = salt;
    return dao;
  }
}
