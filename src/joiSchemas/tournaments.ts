import TournamentType from 'enums/TournamentType';
import Joi from 'joi';
import { ITournament } from 'types/tournament';

const validTournamentTypes = [
  TournamentType.AllStar,
  TournamentType.BagTag,
  TournamentType.League,
  TournamentType.Pro,
  TournamentType.Regional,
  TournamentType.RussianChampionship,
  TournamentType.Federal,
];

export const tournamentSchema: Joi.ObjectSchema<ITournament> =
  Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
    town: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    tournamentType: Joi.string().valid(...validTournamentTypes).required(),
    metrixId: Joi.string().optional().allow(null),
  });

export const tournamentPutSchema: Joi.ObjectSchema<Partial<ITournament>> =
  Joi.object().keys({
    name: Joi.string().required(),
    town: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    tournamentType: Joi.string().valid(...validTournamentTypes).required(),
    metrixId: Joi.string().optional().allow(null),
  });
