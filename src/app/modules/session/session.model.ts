import { Schema, model, Types } from 'mongoose';

export interface IDeviceInfo {
  browser: string;
  os: string;
  ip: string;
}

interface ISession {
  userId: Types.ObjectId;
  sessionId: string;
  deviceInfo?: IDeviceInfo;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, unique: true },
    deviceInfo: {
      browser: { type: String },
      os: { type: String },
      ip: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = model<ISession>('SessionModel', sessionSchema);
