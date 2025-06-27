import historyService from '../services/history.service.js';

class HistoryController {
  addHistory = async (req, res) => {
    try {
      const history = await historyService.addHistory(req.body);
      res.status(201).json(history);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  getHistoryByUser = async (req, res) => {
    try {
      const history = await historyService.getHistoryByUser(req.params.userId);
      res.status(200).json(history);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new HistoryController();
