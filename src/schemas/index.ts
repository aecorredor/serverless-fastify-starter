import { mergeTypeDefs } from '@graphql-tools/merge';

import { UserSchema } from './user-schema';
import { PaginationSchema } from './pagination-schema';

const types = [UserSchema, PaginationSchema];

export const schemaDocumentNode = mergeTypeDefs(types);
