import { configure } from 'safe-stable-stringify';

export const stringify = configure({
  strict: true,
}) as (value: unknown) => string;
