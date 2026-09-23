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
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Go', 'Swift', 'Rust', 'TypeScript', 'Kotlin', 'SQL'] // Add more as needed
  },
  code: {
    type: String,
    required: true,
    maxlength: 100000
  },
  // net score is derived from these arrays at query time (see getSnippets/getTrendingSnippets)
  // rather than stored as a separate counter, so it can never drift out of sync
  upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  // kept in sync atomically with comments so list views can show a count
  // without shipping the whole comments array over the wire
  commentCount: { type: Number, default: 0 }
}, { timestamps: true });

snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ language: 1, createdAt: -1 });
snippetSchema.index({ author: 1, createdAt: -1 });
snippetSchema.index(
  { title: 'text', description: 'text', code: 'text' },
  {
    weights: { title: 10, description: 5, code: 1 },
    name: 'snippet_text',
    // our own `language` field (e.g. "JavaScript") would otherwise be read by MongoDB
    // as the text-search stemming language and rejected as invalid
    language_override: 'textSearchLanguage'
  }
);

const Snippet = mongoose.model('Snippet', snippetSchema);
export default Snippet;