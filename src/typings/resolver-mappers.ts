import { ExampleEntity } from '../entities/example.entity';

export type ExampleEntityMapper = { id: string } & Exclude<
  ExampleEntity,
  'leagueId'
>;
