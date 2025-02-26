import { Request, Response } from 'express';
import BaseService from 'service/base';
import BaseDao from 'dao/base';
import logger from 'helpers/logger';
import { ZodError, fromZodError } from 'zod-validation-error';
import { z } from 'zod';

export type RdgaRequest<
  TDataDb,
  TPrimaryKeyDb extends keyof TDataDb,
> = Request & {
  primaryKeyValue?: TDataDb[TPrimaryKeyDb];
};

class BaseController<
  TData,
  TDataDb,
  TPrimaryKey extends keyof TData,
  TPrimaryKeyDb extends keyof TDataDb,
  TService extends BaseService<TData, TDataDb, TDao>,
  TDao extends BaseDao<TData, TDataDb, TPrimaryKeyDb>,
> {
  protected _service;
  protected _primaryKey;
  protected _primaryKeyDb;
  protected _createSchema;
  protected _updateSchema;
  protected _displayProperty;

  constructor(
    service: TService,
    primaryKey: TPrimaryKey,
    primaryKeyDb: TPrimaryKeyDb,
    createSchema: z.ZodSchema,
    updateSchema: z.ZodSchema,
    displayProperty?: keyof TDataDb,
  ) {
    this._service = service;
    this._primaryKey = primaryKey;
    this._primaryKeyDb = primaryKeyDb;
    this._createSchema = createSchema;
    this._updateSchema = updateSchema;
    this._displayProperty = displayProperty;
  }

  protected _response200(response: Response, value: unknown) {
    return response.status(200).json(value);
  }

  protected _response201(
    response: Response,
    value: TDataDb[keyof TDataDb],
    action: string,
  ) {
    return response.status(201).send(`Value "${value}" ${action}`);
  }

  protected _response400(response: Response, error: string) {
    return response.status(400).send(error);
  }

  protected _response400Schema(response: Response, error: ZodError) {
    return response.status(400).send(fromZodError(error).toString());
  }

  protected _response404(response: Response) {
    return response.status(404).send('Not found');
  }

  protected _response500(response: Response, error: unknown) {
    logger.error(error, 'Something went wrong');
    return response.status(500).send(`Something's wrong: ${error}`);
  }

  protected async _getAllBase(
    _request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    try {
      const values = await this._service.getAll();

      this._response200(response, values);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  protected async _getAllPaginatedBase(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    const pageNumber = Number(request.query.page) || 1;

    try {
      const values = await this._service.getAllPaginated(pageNumber);

      this._response200(response, values);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  protected async _createBase(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    const result = this._createSchema.safeParse(request.body);

    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
    }

    try {
      const createdValue = await this._service.create(result.data);

      this._response201(
        response,
        createdValue[this._displayProperty ?? this._primaryKeyDb],
        'created',
      );
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  protected async _updateBase(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    const result = this._updateSchema.safeParse(request.body);

    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
    }

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }

      const updatedValue = await this._service.update({
        ...result.data,
        [this._primaryKey]: primaryKeyValue,
      });

      this._response200(response, updatedValue);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  protected async _deleteBase(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }

      await this._service.delete(primaryKeyValue);

      this._response201(response, primaryKeyValue, 'deleted');
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  protected async _getByPrimaryKeyBase(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }

      const value = await this._service.getByPrimaryKey(primaryKeyValue);

      if (!value) {
        this._response404(response);
        return;
      }

      this._response200(response, value);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  async getAll(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._getAllBase(request, response);
  }

  async getAllPaginated(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._getAllPaginatedBase(request, response);
  }

  async create(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._createBase(request, response);
  }

  async update(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._updateBase(request, response);
  }

  async delete(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._deleteBase(request, response);
  }

  async getByPrimaryKey(
    request: RdgaRequest<TDataDb, TPrimaryKeyDb>,
    response: Response,
  ) {
    return this._getByPrimaryKeyBase(request, response);
  }
}

export default BaseController;
