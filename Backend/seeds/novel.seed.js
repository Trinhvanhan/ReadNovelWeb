import mongoose from 'mongoose';
import Genre from '../models/genre.model.js';
import Novel from '../models/novel.model.js';
import Chapter from '../models/chapter.model.js';
import { faker } from '@faker-js/faker';

const MONGODB_URI = 'mongodb://localhost:27017/novelWeb';

const GENRES = [
  { name: 'Fantasy', slug: 'fantasy', description: 'Magical worlds and epic adventures.' },
  { name: 'Sci-Fi', slug: 'sci-fi', description: 'Futuristic technology and space travel.' },
  { name: 'Romance', slug: 'romance', description: 'Love stories and emotional journeys.' },
  { name: 'Thriller', slug: 'thriller', description: 'Suspenseful and gripping narratives.' },
  { name: 'Dystopian', slug: 'dystopian', description: 'Dark, futuristic societies.' },
  { name: 'Historical', slug: 'historical', description: 'Stories set in the past.' },
  { name: 'Horror', slug: 'horror', description: 'Scary and supernatural tales.' },
];

export default async function novelSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Reset collections
    await Genre.deleteMany();
    await Novel.deleteMany();
    await Chapter.deleteMany();

    // Insert genres
    const insertedGenres = await Genre.insertMany(GENRES);
    const genreIds = insertedGenres.map(g => g._id);

    // Create novels
    const novelPromises = Array.from({ length: 10 }).map(() => {
      const selectedGenres = faker.helpers.shuffle(genreIds).slice(0, faker.number.int({ min: 1, max: 5 }));
      return Novel.create({
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        coverImage: "/placeholder.svg?height=300&width=200",
        genres: selectedGenres,
        tags: faker.lorem.words(faker.number.int({ min: 2, max: 4 })).split(' '),
        views: faker.number.int({ min: 1000, max: 100000 }),
        favorites: faker.number.int({ min: 100, max: 10000 }),
        followers: faker.number.int({ min: 100, max: 10000 }),
        features: faker.number.int({ min: 0, max: 10 }),
        description: faker.lorem.paragraphs(1),
        rating: {
          count: faker.number.int({ min: 10, max: 5000 }),
          average: faker.number.float({ min: 2.5, max: 5.0, precision: 0.1 }),
        },
        chapters: faker.number.int({ min: 5, max: 20 }),
        status: faker.helpers.arrayElement(['ongoing', 'completed', 'dropped']),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const novels = await Promise.all(novelPromises);

    // Create chapters for each novel
    const chapterPromises = novels.flatMap(novel => {
      const chapterCount = novel.chapters;
      return Array.from({ length: chapterCount }).map((_, idx) => {
        return Chapter.create({
          novelId: novel._id,
          title: `Chapter ${idx + 1}: ${faker.lorem.words(4)}`,
          chapterNumber: idx + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
          wordCount: faker.number.int({ min: 800, max: 2500 }),
          content: faker.lorem.paragraphs(3),
        });
      });
    });

    await Promise.all(chapterPromises);

    console.log('Seeded genres, novels, and chapters successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.disconnect();
  }
}

