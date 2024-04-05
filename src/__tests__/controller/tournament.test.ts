import { Request } from 'express';
import tournamentsController from 'controller/tournament';
import tournamentsService from 'service/tournament';
import response from '../mocks/response';
import testTournament from '__tests__/mocks/testTournament';

jest.mock('service/tournament');

describe('Tournament Controller', () => {
  const testTournamentWithoutCode = {
    name: testTournament.name,
    town: testTournament.town,
    startDate: testTournament.startDate,
    endDate: testTournament.endDate,
    tournamentType: testTournament.tournamentType,
    metrixId: testTournament.metrixId,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (tournamentsService.getAll as jest.Mock).mockReturnValueOnce([]);

      await tournamentsController.getAll(request, response);

      expect(tournamentsService.getAll).toHaveBeenCalledTimes(1);
      expect(tournamentsService.getAll).toHaveBeenCalledWith('', '');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (tournamentsService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.getAll(request, response);

      expect(tournamentsService.getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('create', () => {
    test('should create with 201 response', async () => {
      const request = { body: { ...testTournament } } as unknown as Request;
      (tournamentsService.create as jest.Mock).mockReturnValueOnce({ name: 1 });

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toHaveBeenCalledTimes(1);
      expect(tournamentsService.create).toHaveBeenCalledWith(testTournament);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Турнир 1 создан');
    });

    test('should return 500 if something went wrong', async () => {
      const request = { body: { ...testTournament } } as unknown as Request;
      (tournamentsService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toHaveBeenCalledTimes(1);
      expect(tournamentsService.create).toHaveBeenCalledWith(testTournament);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testTournament, name: 1 },
      } as unknown as Request;

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Validation error: Expected string, received number at "name"',
      );
    });
  });

  describe('update', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { ...testTournamentWithoutCode },
        tournamentCode: 'test',
      } as unknown as Request;

      (tournamentsService.update as jest.Mock).mockReturnValueOnce(
        testTournament,
      );

      await tournamentsController.update(request, response);

      expect(tournamentsService.update).toHaveBeenCalledTimes(1);
      expect(tournamentsService.update).toHaveBeenCalledWith(testTournament);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testTournament);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testTournamentWithoutCode },
        tournamentCode: 'test',
      } as unknown as Request;

      (tournamentsService.update as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.update(request, response);

      expect(tournamentsService.update).toHaveBeenCalledTimes(1);
      expect(tournamentsService.update).toHaveBeenCalledWith(testTournament);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testTournament },
      } as unknown as Request;

      await tournamentsController.update(request, response);

      expect(tournamentsService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Validation error: Unrecognized key(s) in object: 'code'",
      );
    });
  });

  describe('delete', () => {
    test('should response 200 if tournament found and deleted', async () => {
      const request = { tournamentCode: 'test' } as unknown as Request;

      await tournamentsController.delete(request, response);

      expect(tournamentsService.delete).toHaveBeenCalledTimes(1);
      expect(tournamentsService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Турнир test удален');
    });

    test('should handle service throw with 500', async () => {
      const request = { tournamentCode: 'test' } as unknown as Request;
      (tournamentsService.delete as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.delete(request, response);

      expect(tournamentsService.delete).toHaveBeenCalledTimes(1);
      expect(tournamentsService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('getByCode', () => {
    test('should response 200 if tournament found', async () => {
      (tournamentsService.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        code: 'test',
      });
      const request = { tournamentCode: 'test' } as unknown as Request;

      await tournamentsController.getByCode(request, response);

      expect(tournamentsService.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(tournamentsService.getByPrimaryKey).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ code: 'test' });
    });

    test('should handle service throw with 500', async () => {
      const request = { tournamentCode: 'test' } as unknown as Request;
      (tournamentsService.getByPrimaryKey as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await tournamentsController.getByCode(request, response);

      expect(tournamentsService.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(tournamentsService.getByPrimaryKey).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });
});
