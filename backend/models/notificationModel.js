import mongoose from 'mongoose';

// one row per event; flat and unaggregated is fine at this app's scale, and
// keeps read/unread + pagination simple queries instead of fan-out tables
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['comment', 'follow', 'new_snippet'],
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // denormalised so the notification list never needs to populate the actor
  // just to render "alice commented on your snippet"
  actorUsername: {
    type: String,
    required: true
  },
  snippet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet',
    default: null
  },
  snippetTitle: {
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
