import { Module } from '@src/models/module';

describe('Testes funcionais de module (módulos raspberries)', () => {

  beforeAll(async () => await Module.deleteMany({}));

  describe('Ao criar um novo módulo', () => {
    it('deveria criar um módulo com sucesso', async () => {
      const newModule = {
        raspberry: 'teste',
      };

      const response = await global.testRequest.post('/module').send(newModule);

      expect(response.status).toBe(201);
    });

    it('deveria ter um erro 500 quando não tiver body ', async () => {
      const newModule = {};

      const response = await global.testRequest.post('/module').send(newModule);

      expect(response.status).toBe(500);
    });
  });

  describe('Ao buscar os módulos', () => {
    it('deveria retornar uma lista com os módulos', async () => {
      const response = await global.testRequest.get('/module');

      expect(response.status).toBe(200);
    });
  });
});
