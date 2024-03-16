import { z } from 'zod';

export const JwtUser = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
});

export type JwtUser = z.infer<typeof JwtUser>;
