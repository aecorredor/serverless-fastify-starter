import {
  Attribute,
  Entity,
  AutoGenerateAttribute,
  INDEX_TYPE,
} from '@typedorm/common';
import { AUTO_GENERATE_ATTRIBUTE_STRATEGY } from '@typedorm/common';

@Entity({
  name: 'user',
  primaryKey: {
    partitionKey: 'USER#{{id}}',
    sortKey: 'USER#{{id}}',
  },
  indexes: {
    by_email: {
      type: INDEX_TYPE.GSI,
      partitionKey: '{{email}}',
      sortKey: 'USER#{{id}}',
    },
  },
})
export class User {
  @Attribute()
  id!: string;

  @Attribute({ unique: true })
  email!: string;

  @Attribute({ unique: true })
  username!: string;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.ISO_DATE,
    autoUpdate: true,
  })
  updatedAt!: string;
}
