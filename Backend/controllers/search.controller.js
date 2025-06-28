import Novel from '../models/novel.model.js';

class SearchController {
  // GET /search
  async search(req, res) {
    const {
      q,
      genres,
      status,
      rating,
      wordCount,
      language,
      tags,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    // Search text
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ];
    }

    if (genres) filter.genres = { $in: genres.split(',') };
    if (status) filter.status = { $in: status.split(',') };
    if (language) filter.language = { $in: language.split(',') };
    if (tags) filter.tags = { $in: tags.split(',') };

    if (rating) {
      const [min, max] = rating.split(',').map(Number);
      filter.rating = { $gte: min, $lte: max };
    }

    if (wordCount) {
      const [min, max] = wordCount.split(',').map(Number);
      filter.wordCount = { $gte: min, $lte: max };
    }

    const sortOptions = {
      rating: 'rating',
      popularity: 'viewCount',
      newest: 'createdAt',
      updated: 'lastUpdated'
    };

    const sortField = sortOptions[sortBy] || null;
    const sortObj = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } : {};

    const totalCount = await Novel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const novels = await Novel.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const results = novels.map(novel => ({
      id: novel._id,
      title: novel.title,
      author: novel.author,
      description: novel.description,
      coverImage: novel.coverImage,
      genres: novel.genres,
      rating: novel.rating || 4.5,
      ratingCount: novel.ratingCount || 1000,
      chapterCount: novel.chapterCount || 40,
      status: novel.status,
      relevanceScore: Math.random().toFixed(2), // placeholder
      matchedTerms: q ? q.split(' ') : [],
      excerpt: novel.description?.slice(0, 100) + '...'
    }));

    const genresFacet = await Novel.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } }
    ]);

    const statusFacet = await Novel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const executionTime = Math.random() * 0.1;

    res.status(200).json({
      results,
      pagination: {
        currentPage: +page,
        totalPages,
        totalCount,
        hasNext: +page < totalPages,
        hasPrev: +page > 1
      },
      searchInfo: {
        query: q || '',
        executionTime: executionTime.toFixed(3),
        appliedFilters: {
          genres: genres?.split(',') || [],
          status: status?.split(',') || [],
          rating: rating ? rating.split(',').map(Number) : []
        },
        suggestions: q
          ? [`${q} system`, `${q} academy`, `${q} world`]
          : []
      },
      facets: {
        genres: genresFacet.map(g => ({ name: g._id, count: g.count })),
        status: statusFacet.map(s => ({ name: s._id, count: s.count }))
      }
    });
  }

  // GET /search/suggestions
  async suggestions(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Missing query param' });

    const regex = new RegExp(q, 'i');

    const novels = await Novel.find({ title: regex }).limit(3).lean();
    const authors = await Novel.aggregate([
      { $match: { author: regex } },
      { $group: { _id: '$author', novelCount: { $sum: 1 } } },
      { $limit: 3 }
    ]);

    const suggestions = [
      { text: `${q} system`, type: 'query', popularity: 850 },
      ...novels.map(n => ({
        text: n.title,
        type: 'novel',
        id: n._id,
        author: n.author,
        coverImage: n.coverImage
      })),
      ...authors.map(a => ({
        text: a._id,
        type: 'author',
        id: a._id,
        novelCount: a.novelCount
      }))
    ];

    res.status(200).json({ suggestions });
  }
}

export default new SearchController();
