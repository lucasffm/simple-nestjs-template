import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('roles')
export class Role {
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
}
