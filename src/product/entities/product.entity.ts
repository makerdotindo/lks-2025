import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;
}
