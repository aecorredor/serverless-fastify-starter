import DataLoader from 'dataloader';

import { batchRead } from '../utils/dynamo';
import { User } from '../entities/user.entity';

import { stringify } from '../utils/json';

export const getLoaders = () => {
  return {
    user: new DataLoader((keys) =>
      batchRead(User, keys as string[], {
        connectionName: 'user-table-connection',
        keySerializer: (entity) =>
          stringify({
            id: entity.id,
          }),
      })
    ),
  };
};

export type Loaders = ReturnType<typeof getLoaders>;
