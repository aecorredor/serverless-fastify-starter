import { rule } from 'graphql-shield';
import { MercuriusContext } from 'mercurius';
import { AuthenticationError } from '../utils/error';

export const isAuthenticated = rule({ cache: 'contextual' })(
  (parent, args, ctx: MercuriusContext) => {
    if (!!ctx.viewer) return true;

    return new AuthenticationError('Not Authenticated');
  }
);
