import Joi from 'joi';
import TournamentType from 'enums/TournamentType';

export const playerSchema: Joi.ObjectSchema<Player> = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required().allow(null),
  rdgaNumber: Joi.number().required().min(1),
  rdgaRating: Joi.number().optional(),
  rdgaRatingChange: Joi.number().optional(),
  town: Joi.string().optional().allow(null),
  email: Joi.string().optional(),
  pdgaNumber: Joi.number().optional().min(1).allow(null),
  pdgaRating: Joi.number().optional().allow(null),
  metrixNumber: Joi.number().optional().min(1).allow(null),
  metrixRating: Joi.number().optional().allow(null),
  priority: Joi.number().optional(),
});

export const playerPutSchema: Joi.ObjectSchema<Partial<Player>> =
  Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required().allow(null),
    rdgaRating: Joi.number().optional(),
    rdgaRatingChange: Joi.number().optional(),
    town: Joi.string().optional().allow(null),
    email: Joi.string().optional(),
    pdgaNumber: Joi.number().optional().min(1).allow(null),
    pdgaRating: Joi.number().optional().allow(null),
    metrixNumber: Joi.number().optional().min(1).allow(null),
    metrixRating: Joi.number().optional().allow(null),
    priority: Joi.number().optional(),
  });

export const playerUpdateRatingSchema: Joi.ObjectSchema<{ rating: number }> =
  Joi.object().keys({
    rating: Joi.number().required(),
  });

export const tournamentSchema: Joi.ObjectSchema<Tournament> = Joi.object().keys(
  {
    code: Joi.string().required(),
    name: Joi.string().required(),
    town: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    tournamentType: Joi.string().valid(
      TournamentType.AllStar,
      TournamentType.BagTag,
      TournamentType.League,
      TournamentType.National,
      TournamentType.Regional,
    ).required(),
  },
);
