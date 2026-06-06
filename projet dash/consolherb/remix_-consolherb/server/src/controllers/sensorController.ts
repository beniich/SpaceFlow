import { Request, Response, NextFunction } from 'express';
import { SensorType } from '@prisma/client';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';

/**
 * GET /api/sensors
 * Returns all sensors, including the zone they belong to.
 */
export const getAllSensors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: {
        zone: { select: { id: true, name: true, type: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ data: sensors, total: sensors.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sensors/:id
 * Returns a single sensor with its most recent 20 logs.
 */
export const getSensorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const sensor = await prisma.sensor.findUnique({
      where: { id },
      include: {
        zone: true,
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });

    if (!sensor) throw new AppError(`Sensor with id "${id}" not found`, 404);

    res.status(200).json({ data: sensor });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/sensors
 * Creates a new sensor.
 * Body: { name: string, type: SensorType, zoneId: string }
 */
export const createSensor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, type, zoneId } = req.body as {
      name?: string;
      type?: string;
      zoneId?: string;
    };

    if (!name || !type || !zoneId) {
      throw new AppError('Missing required fields: name, type, zoneId', 400);
    }

    const validTypes: SensorType[] = ['TEMPERATURE', 'HUMIDITY', 'SOIL', 'LUMINOSITY'];
    if (!validTypes.includes(type as SensorType)) {
      throw new AppError(
        `Invalid sensor type. Must be one of: ${validTypes.join(', ')}`,
        400
      );
    }

    // Verify the zone exists
    const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!zone) throw new AppError(`Zone with id "${zoneId}" not found`, 404);

    const sensor = await prisma.sensor.create({
      data: { name, type: type as SensorType, zoneId },
      include: { zone: { select: { id: true, name: true } } },
    });

    res.status(201).json({ data: sensor });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sensors/:id/logs
 * Returns the last 50 log entries for a sensor, newest first.
 */
export const getLatestLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify sensor exists
    const sensor = await prisma.sensor.findUnique({ where: { id } });
    if (!sensor) throw new AppError(`Sensor with id "${id}" not found`, 404);

    const logs = await prisma.sensorLog.findMany({
      where: { sensorId: id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    res.status(200).json({ data: logs, total: logs.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/sensors/:id/logs
 * Creates a new sensor log entry.
 * Body: { value: number, unit: string }
 */
export const createLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { value, unit } = req.body as { value?: number; unit?: string };

    if (value === undefined || value === null || !unit) {
      throw new AppError('Missing required fields: value, unit', 400);
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new AppError('Field "value" must be a number', 400);
    }

    // Verify sensor exists
    const sensor = await prisma.sensor.findUnique({ where: { id } });
    if (!sensor) throw new AppError(`Sensor with id "${id}" not found`, 404);

    const log = await prisma.sensorLog.create({
      data: { sensorId: id, value, unit },
    });

    res.status(201).json({ data: log });
  } catch (err) {
    next(err);
  }
};
