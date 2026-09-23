import mongoose from 'mongoose';

// flat, owner-private groupings of a user's own choosing — no nesting, no
// sharing; "collections/folders" here means "a named list of snippet links"
const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  snippets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Snippet' }]
}, { timestamps: true });

collectionSchema.index({ owner: 1, createdAt: -1 });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
