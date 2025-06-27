import commentService from '../services/comment.service.js';

class CommentController {
  createComment = async (req, res) => {
    try {
      const comment = await commentService.createComment(req.body);
      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  getCommentsByChapter = async (req, res) => {
    try {
      const comments = await commentService.getCommentsByChapter(req.params.chapterId);
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new CommentController();
