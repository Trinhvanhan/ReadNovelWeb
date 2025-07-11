import Novel from '../models/novel.model.js';
import Chapter from '../models/chapter.model.js';
import ChapterContent from '../models/chapterContent.model.js'
import Interaction from '../models/interaction.model.js'
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
  //DONE

  getNovelById = async (req, res) => {
    try {
      const { id } = req.params
      const novel = await Novel.findById(id).populate({ path: 'genres', select: 'name -_id'}).lean();
      if (!novel) return res.status(404).json({ message: 'Novel not found' });

      const chapters = await Chapter.find({ novelId: id })
        .sort({ chapterNumber: 1 })
        .select('chapterNumber title createdAt')
        .lean();
      let userInteraction = {
        isFavorited: false,
        isFollowing: false,
        isFeatured: false,
        rating: null,
        lastReadChapter: null,
        readingProgress: null,
      };
      if (req.user) {
        const interactions = await Interaction.find({
          user: req.user.id,
          targetId: id,
          targetType: 'Novel',
        }).lean();

        // Duyệt interaction và cập nhật trạng thái tương ứng
        interactions.forEach((interaction) => {
          switch (interaction.type) {
            case 'favorite':
              userInteraction.isFavorited = true;
              break;
            case 'follow':
              userInteraction.isFollowing = true;
              break;
            case 'feature':
              userInteraction.isFeatured = true;
              break;
            case 'rating':
              userInteraction.rating = interaction.value ?? null;
              break;
            case 'progress':
              userInteraction.readingProgress = interaction.progress ?? null;
              userInteraction.lastReadChapter = interaction.lastReadChapter ?? null;
              break;
          }
        });
      }
      res.status(200).json({
        ...novel,
        id: novel._id,
        chapters: chapters.map(ch => ({
          number: ch.chapterNumber,
          title: ch.title,
          publishedAt: ch.createdAt,
        })),
        author: {
          name: novel.author
        },
        userInteraction
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

      const ch = await Chapter.findOne({ novelId: id, chapterNumber: chapter }).lean();
      if (!ch) return res.status(404).json({ message: 'Chapter not found' });
      const content = await ChapterContent.findOne({ chapterId: ch._id },{ content: 1, _id: 0 }).lean();
      
      const prev = await Chapter.findOne({ novelId: id, chapterNumber: ch.chapterNumber - 1 }).select('chapterNumber title').lean();
      const next = await Chapter.findOne({ novelId: id, chapterNumber: ch.chapterNumber + 1 }).select('chapterNumber title').lean();
      res.status(200).json({
        id: ch._id,
        novelId: id,
        number: ch.chapterNumber,
        title: ch.title,
        content: content.content,
        publishedAt: ch.createdAt,
        updatedAt: ch.updatedAt || ch.createdAt,
        navigation: {
          totalChapters: novel.chapters,
          previousChapter: prev ? { number: prev.chapterNumber, title: prev.title } : null,
          nextChapter: next ? { number: next.chapterNumber, title: next.title } : null
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
