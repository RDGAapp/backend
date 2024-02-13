import TournamentType from 'enums/TournamentType';
import { z } from 'zod';

const validTournamentTypes = [
  TournamentType.AllStar,
  TournamentType.BagTag,
  TournamentType.League,
  TournamentType.Pro,
  TournamentType.Regional,
  TournamentType.RussianChampionship,
  TournamentType.Federal,
] as const;

export const tournamentSchema = z.strictObject({
  code: z.string(),
  name: z.string(),
  town: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  tournamentType: z.enum(validTournamentTypes),
  metrixId: z.string().nullable(),
});

export const tournamentPutSchema = tournamentSchema.omit({ code: true });
