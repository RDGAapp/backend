import Joi from 'joi';

export const playerSchema: Joi.ObjectSchema<Player> = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  rdgaNumber: Joi.number().required().min(1),
  rdgaRating: Joi.number().optional(),
  rdgaRatingChange: Joi.number().optional(),
  town: Joi.string().optional(),
  email: Joi.string().optional(),
  pdgaNumber: Joi.number().optional().min(1),
  pdgaRating: Joi.number().optional(),
  metrixNumber: Joi.number().optional().min(1),
  metrixRating: Joi.number().optional(),
});

export const playerPutSchema: Joi.ObjectSchema<Partial<Player>> = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  rdgaRating: Joi.number().optional(),
  rdgaRatingChange: Joi.number().optional(),
  town: Joi.string().optional(),
  email: Joi.string().optional(),
  pdgaNumber: Joi.number().optional().min(1),
  pdgaRating: Joi.number().optional(),
  metrixNumber: Joi.number().optional().min(1),
  metrixRating: Joi.number().optional(),
});
