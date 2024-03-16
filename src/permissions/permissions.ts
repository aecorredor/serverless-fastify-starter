import { allow, shield } from 'graphql-shield';
import { Rule, RuleFalse, RuleTrue } from 'graphql-shield/typings/rules';

import * as rules from './rules';
import { QueryResolvers, MutationResolvers } from '../generated/resolvers';
import { InternalServerError } from '../utils/error';
import { AppContext } from '../context/index';

export const getPermissions = (): ReturnType<typeof shield> => {
  const Query: Record<keyof QueryResolvers, Rule | RuleTrue | RuleFalse> = {
    getViewer: rules.isAuthenticated,
  };

  const Mutation: Record<keyof MutationResolvers, Rule | RuleTrue | RuleFalse> =
    {
      signIn: allow,
      confirmEmail: allow,
    };

  return shield(
    {
      Query,
      Mutation,
    },
    {
      fallbackError: (error, parent, args, context) => {
        const ctx = context as unknown as AppContext;

        if (!(error instanceof Error)) {
          ctx.logger.error(
            error,
            'The resolver threw something that is not an error.'
          );

          return new InternalServerError();
        }

        // Something's up with the error fallbackError receives; instanceof
        // does not work when checking against custom errors here, so we just
        // check for the custom name property.
        const isExpectedError =
          error.name === 'BadRequestError' ||
          error.name === 'AuthenticationError' ||
          error.name === 'NotFoundError';

        if (isExpectedError) {
          return error;
        }

        ctx.logger.error(error, 'The resolver threw an unhandled error.');
        return new InternalServerError();
      },
    }
  );
};
