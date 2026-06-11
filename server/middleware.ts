import type { Request, Response, NextFunction } from 'express';

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/health') return next();
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`[REQ] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
    });
    next();
  };
}
