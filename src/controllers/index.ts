import { Response } from 'express';
import ApiError, { APIError } from '../utils/errors/api-error';
import logger from '../logger';

export abstract class BaseController {
  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }

  protected sendCreateUpdateErrorResponse(res: Response, error:  Error, status = 500): void {
    if (status != 500) {
      logger.error(error);

      res
        .status(status)
        .send(ApiError.format({ code: status, message: error.message }));
    } else {
      logger.error(error);

      res
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
    }
  }
}