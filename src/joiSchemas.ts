import Joi from 'joi';

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

export const playerPutSchema: Joi.ObjectSchema<Partial<Player>> = Joi.object().keys({
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

export const playerUpdateRatingSchema: Joi.ObjectSchema<{ rating: number }> = Joi.object().keys({
  rating: Joi.number().required(),
});
