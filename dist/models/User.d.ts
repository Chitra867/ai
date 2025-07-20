import { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'analyst' | 'viewer';
    isActive: boolean;
    lastLogin?: Date;
    settings: {
        aiAlerts: boolean;
        emailNotifications: boolean;
        dataRetentionDays: number;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=User.d.ts.map