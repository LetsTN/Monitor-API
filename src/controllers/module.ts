import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Module } from '../models/module';
import { BaseController } from '.';

@Controller('module')
export class ModulesControllers extends BaseController {
  @Get('')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const modules = await Module.find();

      res.status(200).send({ modules });    
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const module = new Module(req.body);
      const result = await module.save();

      res.status(201).send(result);    
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}