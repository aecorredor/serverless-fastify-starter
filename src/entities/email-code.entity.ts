import { Attribute, Entity } from '@typedorm/common';

@Entity({
  name: 'email-code',
  primaryKey: {
    partitionKey: 'EMAIL#{{email}}',
    sortKey: 'EMAIL_CODE#{{code}}',
  },
})
export class EmailCode {
  @Attribute()
  email!: string;

  @Attribute()
  code!: string;

  @Attribute()
  expiresAt!: string;

  @Attribute()
  ttl!: number;
}
