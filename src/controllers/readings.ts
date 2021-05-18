import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Reading } from '../models/reading';
import { Module } from '../models/module';
import { ReadingService } from '../services/reading';
import { BaseController } from '.';

@Controller('reading')
export class ReadingsControllers extends BaseController {
  @Get('')
  public async getCurrentReadingList(req: Request, res: Response): Promise<void> {
    try {
      const readingService = new ReadingService();

      const readings = await readingService.getMostRecentReadingsFromAllModules();

      res.status(200).send({ readings });
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Get(':id')
  public async getMostRecentFromModule(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const module = await Module.findOne({ raspberry: id });

      if (!module) {
        this.sendErrorResponse(res, {
          code: 404,
          message: 'Módulo não encontrado',
        });

        return;
      }

      const readingService = new ReadingService();

      const readings = await readingService.getModuleReadingsFromTheLastDay(module.raspberry);
      
      res.status(200).send({ readings });
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      const reading = new Reading(req.body);
      const result = await reading.save();

      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}

