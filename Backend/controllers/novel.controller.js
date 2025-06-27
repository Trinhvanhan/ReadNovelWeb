import novelService from '../services/novel.service.js';

class NovelController {
  createNovel = async (req, res) => {
    try {
      const novel = await novelService.createNovel(req.body);
      res.status(201).json(novel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  getAllNovels = async (req, res) => {
    try {
      const novels = await novelService.getAllNovels();
      res.status(200).json(novels);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getNovelById = async (req, res) => {
    try {
      const novel = await novelService.getNovelById(req.params.id);
      if (!novel) return res.status(404).json({ message: 'Novel not found' });
      res.status(200).json(novel);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  updateNovel = async (req, res) => {
    try {
      const novel = await novelService.updateNovel(req.params.id, req.body);
      if (!novel) return res.status(404).json({ message: 'Novel not found' });
      res.status(200).json(novel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  deleteNovel = async (req, res) => {
    try {
      const deleted = await novelService.deleteNovel(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Novel not found' });
      res.status(200).json({ message: 'Novel deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new NovelController();
