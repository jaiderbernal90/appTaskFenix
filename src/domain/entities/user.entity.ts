import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  fullname: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'int' })
  age: number;
 
  @Column({ type: 'varchar', select:false })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({name: 'post_id'})
  posts: Post[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}