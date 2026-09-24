import { Notification } from '../models/index.js';

// a failed notification write should never break the action that triggered
// it (posting a comment, following, creating a snippet), so this swallows
// its own errors rather than propagating them to the caller
const safeCreate = async (docs) => {
  try {
    await Notification.create(docs);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const notifyComment = async ({ snippetOwnerId, actor, snippet }) => {
  if (!snippetOwnerId || snippetOwnerId.equals(actor._id)) return;
  await safeCreate({
    recipient: snippetOwnerId,
    type: 'comment',
    actor: actor._id,
    actorUsername: actor.username,
    snippet: snippet._id,
    snippetTitle: snippet.title
  });
};

export const notifyFollow = async ({ followedId, actor }) => {
  await safeCreate({
    recipient: followedId,
    type: 'follow',
    actor: actor._id,
    actorUsername: actor.username
  });
};

export const notifyNewSnippet = async ({ followerIds, actor, snippet }) => {
  if (!followerIds?.length) return;
  await safeCreate(followerIds.map((recipient) => ({
    recipient,
    type: 'new_snippet',
    actor: actor._id,
    actorUsername: actor.username,
    snippet: snippet._id,
    snippetTitle: snippet.title
  })));
};
