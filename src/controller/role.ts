import { Request, Response } from 'express';
import roleService from 'service/role';
import { response400Schema, response500 } from 'helpers/responses';
import { rolePutSchema, roleSchema } from 'schemas';

class RoleController {
  async getAll(_request: Request, response: Response) {
    try {
      const roles = await roleService.getAll();

      return response.status(200).json(roles);
    } catch (error) {
      return response500(response, error);
    }
  }

  async create(request: Request, response: Response) {
    const result = roleSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const roleName = await roleService.create(result.data);

      response.status(201).send(`Role "${roleName}" created`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { roleCode } = request;

    const result = rolePutSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const updatedRole = await roleService.update({
        ...result.data,
        code: roleCode,
      });

      return response.status(200).json(updatedRole);
    } catch (error) {
      return response500(response, error);
    }
  }

  async delete(request: Request, response: Response) {
    const { roleCode } = request;

    try {
      await roleService.delete(roleCode);

      return response.status(200).send(`Role ${roleCode} deleted`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async getByCode(request: Request, response: Response) {
    const { roleCode } = request;

    try {
      const post = await roleService.getByCode(roleCode);

      return response.status(200).json(post);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new RoleController();
