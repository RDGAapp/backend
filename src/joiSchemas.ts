import Joi from 'joi';

export const playerSchema = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  middleName: Joi.string().optional(),
  rdgaNumber: Joi.number().required().min(1),
  rdgaRating: Joi.number().optional(),
  rdgaRatingChange: Joi.number().optional(),
  town: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  email: Joi.string().optional(),
  pdgaNumber: Joi.number().optional().min(1),
  pdgaRating: Joi.number().optional(),
  metrixNumber: Joi.number().optional().min(1),
  metrixRating: Joi.number().optional(),
});
