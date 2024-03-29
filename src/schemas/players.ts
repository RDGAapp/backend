import SportsCategory from 'enums/SportsCategory';
import { z } from 'zod';
import { townSchema } from './common';

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
  town: townSchema.nullable(),
  pdgaNumber: z.number().min(1).nullable(),
  metrixNumber: z.number().min(1).nullable(),
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
