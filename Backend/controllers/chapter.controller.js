import chapterService from '../services/chapter.service.js';

class ChapterController {
  createChapter = async (req, res) => {
    try {
      const chapter = await chapterService.createChapter(req.body);
      res.status(201).json(chapter);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  getChaptersByNovel = async (req, res) => {
    try {
      const chapters = await chapterService.getChaptersByNovel(req.params.novelId);
      res.status(200).json(chapters);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new ChapterController();
