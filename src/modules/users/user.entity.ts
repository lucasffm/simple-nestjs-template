import { Column, PrimaryGeneratedColumn, Entity, BeforeInsert } from 'typeorm';
import { hashSync } from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: string;

  @Column('character varying', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: false,
    name: 'email',
  })
  email: string;

  @Column('character varying', {
    nullable: false,
    name: 'password',
  })
  password: string;

  @Column('character varying', {
    nullable: false,
    name: 'age',
  })
  age: string;

  @Column('character varying', {
    nullable: true,
    name: 'phone',
  })
  phone: string | null;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
