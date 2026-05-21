import { AppError } from './errorHandler.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errorMessages = error.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    );
    next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
  }
};
