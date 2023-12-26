import crypto from 'crypto';
import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: pass => {
        return pass && pass.length >= 5;
      },
      message: 'Password must be at least 5 characters long',
    },
  },
  salt: String, // Store the salt for each user
}, { timestamps: true });

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  user.password = hash; // Store the encrypted password in 'password'
  user.salt = salt;
  next();
});

export const User = models?.User || model('User', UserSchema);
