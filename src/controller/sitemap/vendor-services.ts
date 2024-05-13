import { Request, Response } from 'express';
import { prismaCRODb } from '../../prisma';

export const vendorServicesQuery = async (req: Request, res: Response): Promise<void> => {
  const apiKey = req.query.api_key
  console.log(apiKey);
  if (!apiKey || apiKey !== process.env.CROMATIC_API_KEY) {
    res.status(400).send('API Error: Unauthorized');
    return;
  }

  try {
    const subspecialties = await prismaCRODb.subspecialty.findMany();
    res.status(200).json(subspecialties.map(s => s.name));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(`API Error: ${error.message}`);
    } else {
      res.status(400).send('API Error');
    }
  }
};
