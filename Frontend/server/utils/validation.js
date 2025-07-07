const joi = require("joi")

const schemas = {
  signup: joi.object({
    email: joi.string().email().required(),
    username: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().min(6).required(),
  }),

  login: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),

  updateProfile: joi.object({
    username: joi.string().alphanum().min(3).max(30),
    email: joi.string().email(),
  }),

  updatePreferences: joi.object({
    theme: joi.string().valid("light", "dark", "system"),
    fontSize: joi.number().min(12).max(24),
    fontFamily: joi.string().valid("serif", "sans-serif", "monospace"),
    lineHeight: joi.number().min(1.2).max(2.0),
    readingMode: joi.string().valid("scroll", "paginated"),
  }),

  readingProgress: joi.object({
    novelId: joi.string().required(),
    chapterId: joi.string().required(),
    progress: joi.number().min(0).max(100).required(),
    position: joi.number().min(0),
  }),

  bookmark: joi.object({
    novelId: joi.string().required(),
    chapterId: joi.string().required(),
    position: joi.number().min(0).required(),
    note: joi.string().max(500),
  }),

  novel: joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    description: joi.string().required(),
    genre: joi.string().required(),
    status: joi.string().valid("ongoing", "completed", "hiatus"),
    tags: joi.array().items(joi.string()),
  }),

  chapter: joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    chapterNumber: joi.number().min(1).required(),
  }),
}

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((d) => d.message),
      })
    }
    next()
  }
}

module.exports = {
  schemas,
  validate,
}
