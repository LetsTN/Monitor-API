import { Server } from '@overnightjs/core';
import { Application, json } from 'express';
import expressPino from 'express-pino-logger';
import * as http from 'http';
import cors from 'cors';

import './utils/module-alias';
import * as database from './database';
import logger from './logger';
import { ReadingsControllers } from './controllers/readings';
import { ModulesControllers } from './controllers/module';
import { apiErrorValidator } from './middlewares/api-error-validator';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(json());
    
    this.app.use(
      expressPino({
        logger,
      })
    );

    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupControllers(): void {
    const readingsControllers = new ReadingsControllers();
    const modulesControllers = new ModulesControllers();

    this.addControllers([
      readingsControllers,
      modulesControllers
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server listening of port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();

    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }
  }
}
