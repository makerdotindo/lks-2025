import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ProductEntity } from '@/product/entities/product.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ProductEntity],
});

async function seedProducts() {
  const connection = await dataSource.initialize();
  const productRepo = connection.getRepository(ProductEntity);

  const products: ProductEntity[] = [
    {
      id: 1,
      name: 'Oreo Sandwich Original',
      price: 2000,
      image: 'https://lks.makeredu.id/public/oreo.jpg',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'beng-beng Coklat',
      price: 2500,
      image: 'https://lks.makeredu.id/public/beng-beng.jpg',
      rating: 4.82,
    },
    {
      id: 3,
      name: 'Delfi Dairy Milk Cokelat',
      price: 16000,
      image: 'https://lks.makeredu.id/public/delfi-coklat.jpg',
      rating: 4.72,
    },
    {
      id: 4,
      name: 'Pocari Sweat 350ml',
      price: 6000,
      image: 'https://lks.makeredu.id/public/pocari.jpg',
      rating: 4.72,
    },
    {
      id: 5,
      name: 'Golda Coffee',
      price: 3500,
      image: 'https://lks.makeredu.id/public/golda.jpg',
      rating: 4.64,
    },
    {
      id: 6,
      name: 'Teh Pucuk 350ml',
      price: 3500,
      image: 'https://lks.makeredu.id/public/tehpucuk.jpg',
      rating: 4.68,
    },
  ];

  for (const product of products) {
    const newProduct = productRepo.create(product);
    await productRepo.save(newProduct);
    console.log(`Seeded product: ${newProduct.name}`);
  }

  await connection.destroy();
}

seedProducts()
  .then(() => console.log('Product seeding completed successfully.'))
  .catch((error) => console.error('Error seeding products:', error));
