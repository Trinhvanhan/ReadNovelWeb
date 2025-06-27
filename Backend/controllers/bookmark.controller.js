import bookmarkService from '../services/bookmark.service.js';

class BookmarkController {
  addBookmark = async (req, res) => {
    try {
      const bookmark = await bookmarkService.addBookmark(req.body);
      res.status(201).json(bookmark);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  getBookmarksByUser = async (req, res) => {
    try {
      const bookmarks = await bookmarkService.getBookmarksByUser(req.params.userId);
      res.status(200).json(bookmarks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  removeBookmark = async (req, res) => {
    try {
      const removed = await bookmarkService.removeBookmark(req.params.id);
      res.status(200).json({ message: 'Bookmark removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new BookmarkController();
