import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const snippetSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Go', 'Swift', 'Rust', 'TypeScript', 'Kotlin', 'SQL'] // Add more as needed
  },
  code: {
    type: String,
    required: true
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
}, { timestamps: true });

const Snippet = mongoose.model('Snippet', snippetSchema);
export default Snippet;