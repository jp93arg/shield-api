import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

type ValidateOptions = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export const validateRequest = (schemas: ValidateOptions): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationErrors: Record<string, any> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        validationErrors.body = result.error.format();
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        validationErrors.params = result.error.format();
      } else {
        req.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        validationErrors.query = result.error.format();
      } else {
        req.query = result.data;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      res.status(400).json({
        message: "Validation error",
        errors: validationErrors
      });
      return;
    }

    next();
  };
};
