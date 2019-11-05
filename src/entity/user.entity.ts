import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { Role } from './role.entity';

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
    unique: true,
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

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
