import { Response } from 'express';
import { ValidationError } from 'joi';

const rusHaveToBe = {
  м: 'должен быть',
  ж: 'должна быть',
  ср: 'должно быть',
};

export const response500 = (response: Response, error: unknown) => response
  .status(500).send(`Что-то пошло не так: ${error}`);

export const response400Joi = (response: Response, error: ValidationError) => response
  .status(400).send(`Проверьте данные: ${error.details[0].message}`);

/**
 * @param response - объект для ответа на запрос
 * @param fieldName - название поля с большой буквы в именительном падеже
 * @param fieldType - тип поля в творительном падеже
 * @param fieldNameGender - мужской/женский/средний род названия поля
*/
export const response400 = (response: Response, fieldName: string, fieldType: string, fieldNameGender: 'м' | 'ж' | 'ср') => response
  .status(400).send(`${fieldName} ${rusHaveToBe[fieldNameGender]} ${fieldType}`);
