import { Reading } from '@src/models/reading';

describe('Readings functional tests', () => {

  beforeAll(async () => await Reading.deleteMany({}));

  describe('When creating a new reading', () => {
    it('should create a reading with success', async () => {
      const newReading = {
        module: 'teste',
        co: 123,
        glp: 123,
        bpm: 123,
        time: new Date(Date.now()),
      };

      const response = await global.testRequest.post('/reading').send(newReading);

      expect(response.status).toBe(201);
    });

    it('deveria ter um erro 500 quando não tiver body ', async () => {
      const newReading = {};

      const response = await global.testRequest.post('/reading').send(newReading);

      expect(response.status).toBe(500);
    });
  });

  describe('Ao buscar as leituras mais recentes dos módulos', () => {
    it('deveria retornar uma lista com as leituras mais recentes dos módulos', async () => {
      const response = await global.testRequest.get('/reading');

      expect(response.status).toBe(200);
    });
  });

  describe('Ao buscar as leituras de um módulo', () => {
    it('deveria retornar uma lista com as 15 leituras masi recentes de um módulo', async () => {
      const response = await global.testRequest.get('/reading/teste');

      expect(response.status).toBe(200);
    });
  });
});
