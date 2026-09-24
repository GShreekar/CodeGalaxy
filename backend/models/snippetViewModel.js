import mongoose from 'mongoose';

// one row per detail-page view, used only to answer "how many views in the
// last N days" — the all-time total lives on Snippet.views instead, so this
// collection only needs to survive the longest window we ever query (35
// days) and self-prunes via the TTL index below instead of needing a cron job
const snippetViewSchema = new mongoose.Schema({
  snippet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 35
  }
});

snippetViewSchema.index({ snippet: 1, createdAt: -1 });

const SnippetView = mongoose.model('SnippetView', snippetViewSchema);
export default SnippetView;
