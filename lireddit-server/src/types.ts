import {Request, Response} from 'express';
import {Session, SessionData } from 'express-session';
import {Redis} from 'ioredis'
import {createUserLoader} from './utils/createUserLoader';
import {createUpdootLoader} from './utils/createUpdootLoader';

export type MyContext = {
    redis: Redis;
    req: Request & {session: Session & Partial<SessionData> & {userId: number}};
    res: Response;
    userLoader: ReturnType<typeof createUserLoader>
    updootLoader: ReturnType<typeof createUpdootLoader>
}
