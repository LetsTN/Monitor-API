/* eslint-disable @typescript-eslint/no-explicit-any */

import { Module } from '../models/module';
import { Reading } from '../models/reading';

export class ReadingService {
  private pointColors = {
    red: '#BE1931',
    green: '#74A827',
    yellow: '#E4BA14',
    gray: '#C4C4C4'
  }

  public async getModuleReadingsFromTheLastDay(module: string): Promise<any>{
    const endTime = new Date(Date.now()); // 
    const startTime = new Date(
      endTime.getFullYear(),
      endTime.getMonth(),
      endTime.getDate() - 1
      ); // começar procurando há 1 dia

      const readings = await Reading.find({
        module: module,
        time: {
          $gt: startTime,
          $lt: endTime
        }
      }).sort({ time: 'desc'});

    //  já retorna os dados estruturados para serem renderizados pelo Google Charts
    const co: any[] = [['Hora da leitura', 'Valor (ppm)', {'type': 'string', 'role': 'style'}]];
    const glp: any[] = [['Hora da leitura', 'Valor (ppm)', {'type': 'string', 'role': 'style'}]];
    const bpm: any[] = [['Hora da leitura', 'Valor (bpm)', {'type': 'string', 'role': 'style'}]];

    const timeOptions = {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium',
    }

    readings.map(reading => {
      co.push([
        reading.time.toLocaleString('pt-br', timeOptions), 
        reading.co, 
        `point { visible: true; size: 5; fill-color: ${this.getColorsFromValues(reading.co, 'CO')}; }`
      ]);
      glp.push([
        reading.time.toLocaleString('pt-br', timeOptions), 
        reading.glp, 
        `point { visible: true; size: 5; fill-color: ${this.getColorsFromValues(reading.glp, 'GLP')}; }`
      ]);
      bpm.push([
        reading.time.toLocaleString('pt-br', timeOptions), 
        reading.bpm, 
        `point { visible: true; size: 5; fill-color: ${this.getColorsFromValues(reading.bpm, 'BPM')}; }`
      ]);
    })

    return {co, glp, bpm};
  }

  public async getMostRecentReadingsFromAllModules(): Promise<any[]> {
    const modules = await this.getRegisteredModules();

    const readings: any = {};

    const endTime = new Date(Date.now()); 
    const startTime = new Date(
      endTime.getFullYear(),
      endTime.getMonth(),
      endTime.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds() - 5
      ); //começar procurando há 5 seg

    for (const module of modules) {
      const reading = await Reading.findOne({
        module: module.raspberry,
        time: {
          $gt: startTime,
          $lt: endTime
        }
      }).sort({ time: 'desc'});

      if (reading) {
        readings[<string>module.raspberry] = {
          co: reading.co,
          glp: reading.glp,
          bpm: reading.bpm,
        };
      } else {
        readings[<string>module.raspberry] = {
          co: null,
          glp: null,
          bpm: null,
        };
      }

    }

    return readings;
  }

  private async getRegisteredModules(): Promise<Module[]>{
    const modules = await Module.find();

    return modules;
  }

  private getColorsFromValues(value: number, type: string) {
    switch (type) {
      case 'CO':
        return this.getCOColors(value);

      case 'GLP':
        return this.getGLPColors(value);

      case 'BPM':
        return this.getBPMColors(value);
    
      default:
        return this.pointColors.gray;
    }
  }

  private getCOColors(value: number) {
    if (value > 50) {
      return this.pointColors.red;
    } else {
      if (value > 30) {
        return this.pointColors.yellow;
      } else {
        return this.pointColors.green;
      }
    }
  }

  private getGLPColors(value: number) {
    if (value > 1000) {
      return this.pointColors.red;
    } else {
      if (value > 500) {
        return this.pointColors.yellow;
      } else {
        return this.pointColors.green;
      }
    }
  }

  private getBPMColors(value: number) {
    if (value > 140) {
      return this.pointColors.red;
    } else {
      if (value > 120) {
        return this.pointColors.yellow;
      } else {
        return this.pointColors.green;
      }
    }
  }
}