import { z } from 'zod';
import { townSchema } from './common';
import { TournamentType } from 'types/db';

export const tournamentSchema = z.strictObject({
  code: z.string(),
  name: z.string(),
  town: townSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  tournamentType: z.nativeEnum(TournamentType),
  metrixId: z.string().nullable(),
});

export const tournamentPutSchema = tournamentSchema.omit({ code: true });
