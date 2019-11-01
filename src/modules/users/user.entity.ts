import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

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
}
