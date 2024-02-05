import SportsCategory from 'enums/SportsCategory';
import Joi from 'joi';
import { IPlayer } from 'types/player';

const validSportsCategory = [
  SportsCategory.Master,
  SportsCategory.Candidate,
  SportsCategory.AdultFirst,
  SportsCategory.AdultSecond,
  SportsCategory.AdultThird,
  SportsCategory.JuniorFirst,
  SportsCategory.JuniorSecond,
  SportsCategory.JuniorThird,
];

export const playerSchema: Joi.ObjectSchema<IPlayer> = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required().allow(null),
  rdgaNumber: Joi.number().required().min(1),
  rdgaRating: Joi.number().optional(),
  rdgaRatingChange: Joi.number().optional(),
  town: Joi.string().optional().allow(null),
  email: Joi.string().optional(),
  pdgaNumber: Joi.number().optional().min(1).allow(null),
  metrixNumber: Joi.number().optional().min(1).allow(null),
  priority: Joi.number().optional(),
  activeTo: Joi.date().raw().required(),
  sportsCategory: Joi.string().valid(...validSportsCategory).optional().allow(null),
});

export const playerPutSchema: Joi.ObjectSchema<Partial<IPlayer>> =
  Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required().allow(null),
    rdgaRating: Joi.number().optional(),
    rdgaRatingChange: Joi.number().optional(),
    town: Joi.string().optional().allow(null),
    email: Joi.string().optional(),
    pdgaNumber: Joi.number().optional().min(1).allow(null),
    metrixNumber: Joi.number().optional().min(1).allow(null),
    priority: Joi.number().optional(),
    activeTo: Joi.date().raw().required(),
    sportsCategory: Joi.string().valid(...validSportsCategory).optional().allow(null),
  });

export const playerUpdateRatingSchema: Joi.ObjectSchema<{ rating: number }> =
  Joi.object().keys({
    rating: Joi.number().required(),
  });

export const multipleRdgaRatingUpdateSchema: Joi.ArraySchema<
  { rdgaNumber: number; rating: number }[]
> = Joi.array().items(
  Joi.object().keys({
    rdgaNumber: Joi.number().required(),
    rating: Joi.number().required(),
  }),
);
