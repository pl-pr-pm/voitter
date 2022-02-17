import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  text: string;

  @Column()
  tweetCreatedAt: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
