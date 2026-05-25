const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoPublicId: { type: String, required: true },
  duration: { type: Number, default: 0 },
  notes: { type: String,  default: "" },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    thumbnailUrl: { type: String },
    thumbnailPublicId: { type: String },
    isPublished: { type: Boolean, default: false },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
