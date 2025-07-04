import mongoose from 'mongoose';
import Novel from '../models/novel.model.js';

// MongoDB connection URI
const MONGODB_URI = 'mongodb://localhost:27017/novelWeb';

const featuredNovels = [
  {
    title: "The Midnight Chronicles",
    author: "Sarah Chen",
    coverImage: "/placeholder.svg?height=300&width=200",
    rating: 4.8,
    chapters: 45,
    genre: "Fantasy",
    description: "A thrilling tale of magic and adventure in a world where darkness threatens to consume everything.",
    isNew: true,
  },
  {
    title: "Digital Hearts",
    author: "Alex Rivera",
    coverImage: "/placeholder.svg?height=300&width=200",
    rating: 4.6,
    chapters: 32,
    genre: "Sci-Fi Romance",
    description: "Love blooms in the digital age as two programmers navigate virtual reality and real emotions.",
    isNew: false,
  },
  {
    title: "The Last Library",
    author: "Emma Thompson",
    coverImage: "/placeholder.svg?height=300&width=200",
    rating: 4.9,
    chapters: 28,
    genre: "Dystopian",
    description: "In a world where books are forbidden, one librarian fights to preserve human knowledge.",
    isNew: true,
  },
];

async function novelSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Novel.deleteMany(); // Clear existing data (optional)
    await Novel.insertMany(featuredNovels);
    console.log('✅ Featured novels seeded successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding novels:', err);
    mongoose.disconnect();
  }
}

export default novelSeed;
