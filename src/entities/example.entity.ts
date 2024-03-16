import { Attribute, Entity, AutoGenerateAttribute } from '@typedorm/common';
import { AUTO_GENERATE_ATTRIBUTE_STRATEGY } from '@typedorm/common';

@Entity({
  name: 'exampleEntity',
  primaryKey: {
    partitionKey: 'ENTITY#{{entityId}}',
    sortKey: 'ENTITY_OWNER#{{ownerId}}',
  },
})
export class ExampleEntity {
  @Attribute()
  entityId!: string;

  @Attribute()
  ownerId!: string;

  @Attribute()
  name!: string;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.ISO_DATE,
    autoUpdate: true,
  })
  updatedAt!: string;
}
