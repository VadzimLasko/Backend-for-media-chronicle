import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false }) // с этой опцией при работе с БД нам будет возвращаться объект юсер без ключа пароль
  password: string;

  @BeforeInsert() // что делать с паролем перед его вставкой в БД (перед самой первой вставкой)
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10); //npm run db:create src/migrations/CreateUsers потом npm run db:migrate
  }
}
