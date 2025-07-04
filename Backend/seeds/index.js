import novelSeed from "./novel.seed.js";

async function seedAll() {
  try {
    await novelSeed();
    console.log('✅ All seeds executed successfully!');
  } catch (err) {
    console.error('❌ Error executing seeds:', err);
  }
}

seedAll();