import { Request } from 'express';

interface RequestWithUserInfo extends Request {
    user: JWTUser;
}
