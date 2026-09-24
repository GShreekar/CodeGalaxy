import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // bumped on logout to invalidate every JWT issued before that point
  tokenVersion: {
    type: Number,
    default: 0
  },
  usersnippets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  }],
  // denormalised both ways (who I follow, who follows me) so profile counts
  // and "notify my followers" fan-out are both O(1) reads, no reverse query
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;