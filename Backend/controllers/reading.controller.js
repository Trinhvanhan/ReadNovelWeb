import History from '../models/history.model.js';
import Bookmark from '../models/bookmark.model.js';
import Novel from '../models/novel.model.js';
import Chapter from '../models/chapter.model.js';
import mongoose from 'mongoose';

class ReadingController {
  // GET /reading/progress
  getProgress = async (req, res) => {
    const userId = req.user._id;

    const history = await History.find({ user: userId }).populate('novel').lean();

    const progress = history.map(h => {
      const novel = h.novel;
      return {
        novelId: novel._id,
        novel: {
          id: novel._id,
          title: novel.title,
          author: novel.author,
          coverImage: novel.coverImage,
          chapterCount: Chapter.countDocuments({ novelId: novel._id }) // You can use Chapter.countDocuments later
        },
        currentChapter: h.chapterNumber,
        currentPosition: h.position,
        lastReadAt: h.lastReadAt,
        totalReadingTime: h.totalReadingTime,
        progressPercentage: (h.chapterNumber / 45).toFixed(2), // fake calc
        isCompleted: false
      };
    });

    // Fake stats
    const stats = {
      totalNovels: progress.length,
      completedNovels: progress.filter(p => p.progressPercentage >= 1).length,
      totalChapters: progress.reduce((acc, p) => acc + p.currentChapter, 0),
      totalReadingTime: progress.reduce((acc, p) => acc + p.totalReadingTime, 0),
      averageReadingSpeed: 250
    };

    res.status(200).json({ progress, stats });
  };

  // POST /reading/progress
  updateProgress = async (req, res) => {
    const { novelId, chapterNumber, position, readingTime } = req.body;
    const userId = req.user._id;

    const history = await History.findOneAndUpdate(
      { user: userId, novel: novelId },
      {
        $set: {
          chapterNumber,
          position,
          lastReadAt: new Date()
        },
        $inc: {
          totalReadingTime: readingTime || 0
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      novelId,
      chapterNumber,
      position,
      lastReadAt: history.lastReadAt,
      totalReadingTime: history.totalReadingTime,
      progressPercentage: (chapterNumber / 45).toFixed(2), // dummy value
      milestone: chapterNumber % 10 === 0
        ? {
            type: 'chapter_milestone',
            message: `You've read ${chapterNumber} chapters! Keep going!`,
            reward: 'achievement_badge'
          }
        : null
    });
  };

  // GET /reading/bookmarks
  getBookmarks = async (req, res) => {
    const { page = 1, limit = 20, novelId } = req.query;
    const userId = req.user._id;
    const query = { user: userId };
    if (novelId) query.novel = novelId;

    const totalCount = await Bookmark.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const bookmarks = await Bookmark.find(query)
      .skip((page - 1) * limit)
      .limit(+limit)
      .populate('novel')
      .lean();

    const enriched = await Promise.all(bookmarks.map(async (b) => {
      const chapter = await Chapter.findOne({ novel: b.novel._id, chapterNumber: b.chapterNumber });
      return {
        id: b._id,
        novelId: b.novel._id,
        chapterNumber: b.chapterNumber,
        position: b.position,
        note: b.note,
        createdAt: b.createdAt,
        novel: {
          id: b.novel._id,
          title: b.novel.title,
          author: b.novel.author,
          coverImage: b.novel.coverImage
        },
        chapter: chapter
          ? {
              number: chapter.chapterNumber,
              title: chapter.title,
              excerpt: '...the truth about her heritage was finally revealed...'
            }
          : null
      };
    }));

    res.status(200).json({
      bookmarks: enriched,
      pagination: {
        currentPage: +page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  };

  // POST /reading/bookmarks
  toggleBookmark = async (req, res) => {
    const { novelId, chapterNumber, position, note } = req.body;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ user: userId, novel: novelId, chapterNumber });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        id: existing._id,
        novelId,
        chapterNumber,
        isBookmarked: false
      });
    }

    const bookmark = await Bookmark.create({
      user: userId,
      novel: novelId,
      chapterNumber,
      position,
      note
    });

    res.status(200).json({
      id: bookmark._id,
      novelId,
      chapterNumber,
      position,
      note,
      createdAt: bookmark.createdAt,
      isBookmarked: true
    });
  };
}

export default new ReadingController();
