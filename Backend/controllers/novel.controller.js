import Novel from '../models/novel.model.js';
import Chapter from '../models/chapter.model.js';

class NovelController {
  getNovels = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        genre,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};
      if (genre) query.genres = genre;
      if (status) query.status = status;

      const totalCount = await Novel.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      const novels = await Novel.find(query).populate({
          path: 'genres',              
          select: 'name -_id'     
        })
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Math.min(limit, 100))
        .lean();

      res.status(200).json({
        novels,
        pagination: {
          currentPage: +page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getNovelById = async (req, res) => {
    try {
      const { id } = req.params;
      const novel = await Novel.findById(id).lean();
      if (!novel) return res.status(404).json({ message: 'Novel not found' });

      const chapters = await Chapter.find({ novel: id })
        .sort({ chapterNumber: 1 })
        .select('chapterNumber title createdAt')
        .lean();

      res.status(200).json({
        ...novel,
        id: novel._id,
        chapters: chapters.map(ch => ({
          number: ch.chapterNumber,
          title: ch.title,
          wordCount: 3000, // mock
          publishedAt: ch.createdAt,
          isLocked: false
        })),
        author: {
          id: 'author_456',
          name: novel.author,
          avatar: 'https://example.com/authors/default.jpg',
          bio: 'Fantasy author with 10+ years of experience...',
          novelCount: 3,
          followerCount: 15000
        },
        userInteraction: {
          isFavorited: true,
          isFollowing: true,
          rating: 5,
          lastReadChapter: 12,
          readingProgress: 0.27
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getChapter = async (req, res) => {
    try {
      const { id, chapter } = req.params;
      const novel = await Novel.findById(id).lean();
      if (!novel) return res.status(404).json({ message: 'Novel not found' });

      const ch = await Chapter.findOne({ novel: id, chapterNumber: chapter }).lean();
      if (!ch) return res.status(404).json({ message: 'Chapter not found' });

      const prev = await Chapter.findOne({ novel: id, chapterNumber: chapter - 1 }).select('chapterNumber title').lean();
      const next = await Chapter.findOne({ novel: id, chapterNumber: chapter + 1 }).select('chapterNumber title').lean();

      res.status(200).json({
        id: ch._id,
        novelId: id,
        number: ch.chapterNumber,
        title: ch.title,
        content: 'This is the mock content of the chapter...',
        wordCount: 3000,
        publishedAt: ch.createdAt,
        updatedAt: ch.updatedAt || ch.createdAt,
        isLocked: false,
        navigation: {
          previousChapter: prev ? { number: prev.chapterNumber, title: prev.title, isLocked: false } : null,
          nextChapter: next ? { number: next.chapterNumber, title: next.title, isLocked: false } : null
        },
        novel: {
          id: novel._id,
          title: novel.title,
          author: novel.author,
          coverImage: novel.coverImage
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new NovelController();
