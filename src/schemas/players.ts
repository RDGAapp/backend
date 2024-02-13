import SportsCategory from 'enums/SportsCategory';
import { z } from 'zod';

const validSportsCategory = [
  SportsCategory.Master,
  SportsCategory.Candidate,
  SportsCategory.AdultFirst,
  SportsCategory.AdultSecond,
  SportsCategory.AdultThird,
  SportsCategory.JuniorFirst,
  SportsCategory.JuniorSecond,
  SportsCategory.JuniorThird,
] as const;

export const playerSchema = z.strictObject({
  name: z.string(),
  surname: z.string().nullable(),
  rdgaNumber: z.number().min(1),
  rdgaRating: z.number().nonnegative(),
  rdgaRatingChange: z.number(),
  town: z.string().nullable(),
  email: z.string().email(),
  pdgaNumber: z.number().min(1).nullable(),
  metrixNumber: z.number().min(1).nullable(),
  priority: z.number(),
  activeTo: z.string().datetime(),
  sportsCategory: z.enum(validSportsCategory).nullable(),
});

export const playerPutSchema = playerSchema.omit({ rdgaNumber: true });

export const playerUpdateRatingSchema = z.strictObject({
  rating: playerSchema.shape.rdgaRating,
});

export const multipleRdgaRatingUpdateSchema = z
  .strictObject({
    rdgaNumber: playerSchema.shape.rdgaNumber,
    rating: playerSchema.shape.rdgaRating,
  })
  .array();
