import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';

import { JwtUser } from '../../typings/user';
import { Config } from '../../config/index';

export const createAccessToken = (
  user: JwtUser,
  { config }: { config: Config }
) => {
  const { id, email, username } = user;

  return jwt.sign(
    {
      id,
      email,
      username,
    },
    config.get<string>('Auth.accessTokenSecret'),
    // TODO: shorten + implement refresh tokens.
    { expiresIn: '7d' }
  );
};

export const getViewer = ({
  req,
  config,
}: {
  req: FastifyRequest;
  config: Config;
}): JwtUser | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const accessToken = authHeader.replace('Bearer ', '');

  try {
    const payload = JwtUser.safeParse(
      jwt.verify(accessToken, config.get<string>('Auth.accessTokenSecret'))
    );

    if (!payload.success) {
      return null;
    }

    return payload.data;
  } catch (error) {
    return null;
  }
};
