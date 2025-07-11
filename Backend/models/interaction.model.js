// models/Interaction.ts
import mongoose from "mongoose"

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      enum: ["Novel", "Chapter", "Comment"], // bạn có thể mở rộng
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "favorite", "feature", "view"],
      required: true,
    },
  },
  { timestamps: true }
)

interactionSchema.index({ user: 1, targetId: 1, targetType: 1, type: 1 }, { unique: true })

export default mongoose.model("Interaction", interactionSchema)
