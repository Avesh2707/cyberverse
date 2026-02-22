const mongoose = require('mongoose');

const learningModuleSchema = new mongoose.Schema(
  {
    domain_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    content_markdown: { type: String, required: true },
    video_url: { type: String, default: '' },
    resources_links: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['article', 'video', 'tool', 'paper'], default: 'article' },
      },
    ],
    order: { type: Number, default: 0 },
    duration_minutes: { type: Number, default: 15 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningModule', learningModuleSchema);
