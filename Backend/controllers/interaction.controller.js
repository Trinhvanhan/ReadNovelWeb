import  Interaction from "../models/interaction.model.js"
import Novel from "../models/novel.model.js"

class InteractionController {
  toggleInteration = async (req, res) => {
    const userId = req.user.id
    const { targetId, targetType, type } = req.body

    const validTypes = ["follow", "favorite", "feature", "view"]
    if (!validTypes.includes(type))
      return res.status(400).json({ status: 0, message: "Invalid interaction type" })

    try {
      const existing = await Interaction.findOne({ user: userId, targetId, targetType, type })

      if (type === "view") {
        // chỉ ghi nhận view 1 lần với mỗi user + novel
        if (existing) {
          return res.json({ status: 1, message: "View already counted" })
        }

        await Interaction.create({ user: userId, targetId, targetType, type })
        await Novel.findByIdAndUpdate(targetId, { $inc: { views: 1 } })

        return res.json({ status: 1, message: "View counted" })
      }

      // Toggle các loại interaction khác (follow, favorite, feature)
      if (existing) {
        await existing.deleteOne()

        // Giảm đếm trong Novel nếu có trường tương ứng
        const updateField = type == 'follow' ? 'followers' : `${type}s` // ví dụ: follows, favorites, features
        await Novel.findByIdAndUpdate(targetId, { $inc: { [updateField]: -1 } })

        return res.json({ status: 1, message: `${type} removed` })
      } else {
        await Interaction.create({ user: userId, targetId, targetType, type })

        // Tăng đếm trong Novel nếu có trường tương ứng
        const updateField = `${type}s`
        await Novel.findByIdAndUpdate(targetId, { $inc: { [updateField]: 1 } })

        return res.json({ status: 1, message: `${type} added` })
      }
    } catch (err) {
      console.error("Interaction error:", err)
      res.status(500).json({ status: 0, message: "Server error" })
    }
  }
}

export default new InteractionController()
