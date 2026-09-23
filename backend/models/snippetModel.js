import mongoose from 'mongoose';
import { LANGUAGES } from '../constants/languages.js';

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
  // denormalised display cache — the real relationship (and the only thing
  // ownership checks trust) is authorId; kept in sync at write time
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
    enum: LANGUAGES
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
  // symmetric with upvoters/downvoters: "who bookmarked this", toggled the
  // same atomic way, so "my bookmarks" is just another listSnippets filter
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  // kept in sync atomically with comments so list views can show a count
  // without shipping the whole comments array over the wire
  commentCount: { type: Number, default: 0 },
  tags: {
    type: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 10,
      message: 'A snippet can have at most 10 tags'
    }
  },
  // set once at fork time, never changed — the attribution link back to
  // whatever snippet this one was copied from (null for an original)
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet',
    default: null
  }
}, { timestamps: true });

snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ language: 1, createdAt: -1 });
snippetSchema.index({ author: 1, createdAt: -1 });
snippetSchema.index({ tags: 1 });
snippetSchema.index({ bookmarkedBy: 1 });
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

// keeps User.usersnippets and any Collection referencing this snippet in sync
// on delete, without a multi-document transaction (this deployment runs a
// standalone MongoDB, which transactions require a replica set for); models
// are looked up lazily via mongoose.model() to avoid circular imports
snippetSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  await Promise.all([
    mongoose.model('User').findByIdAndUpdate(doc.authorId, { $pull: { usersnippets: doc._id } }),
    mongoose.model('Collection').updateMany({ snippets: doc._id }, { $pull: { snippets: doc._id } })
  ]);
});

const Snippet = mongoose.model('Snippet', snippetSchema);
export default Snippet;