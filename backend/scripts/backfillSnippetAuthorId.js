// One-off migration: backfills Snippet.authorId for documents created before
// that field existed, by matching the denormalised `author` username string
// against a real User. Safe to re-run — already-backfilled snippets are
// skipped, and the "CodeGalaxy" system user is only created once.
//
// Usage: npm run migrate:authorId
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Snippet, User } from '../models/index.js';

dotenv.config();

const SYSTEM_USERNAME = 'CodeGalaxy';

async function ensureSystemUser() {
  const existing = await User.findOne({ username: SYSTEM_USERNAME });
  if (existing) return existing;

  const user = await User.create({
    name: SYSTEM_USERNAME,
    username: SYSTEM_USERNAME,
    email: 'codegalaxy@system.local',
    password: crypto.randomBytes(32).toString('hex')
  });
  console.log(`Created system user "${SYSTEM_USERNAME}" (${user._id})`);
  return user;
}

async function backfill() {
  const orphaned = await Snippet.find({ authorId: { $exists: false } }).select('_id author');
  console.log(`Found ${orphaned.length} snippet(s) missing authorId`);
  if (orphaned.length === 0) return;

  const systemUser = await ensureSystemUser();
  const userByUsername = new Map([[SYSTEM_USERNAME, systemUser]]);
  let matched = 0;
  let skipped = 0;

  for (const snippet of orphaned) {
    let user = userByUsername.get(snippet.author);
    if (!user) {
      user = await User.findOne({ username: snippet.author });
      if (user) userByUsername.set(snippet.author, user);
    }

    if (!user) {
      console.warn(`  no matching user for author "${snippet.author}" (snippet ${snippet._id}) — skipped`);
      skipped += 1;
      continue;
    }

    await Snippet.updateOne({ _id: snippet._id }, { $set: { authorId: user._id } });
    matched += 1;
  }

  console.log(`Backfilled ${matched} snippet(s), skipped ${skipped} with no matching user`);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await backfill();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
