import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthRequest extends Request {
    user?: IUser;
    body: any;
    query: any;
    params: any;
    file?: any;
    files?: any;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>;
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => any;
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map