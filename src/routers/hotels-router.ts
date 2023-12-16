import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotelsWithRooms, getHotels, getHotelsWithRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', getHotelsWithRooms)
  .get('/allHotels/withRooms', getAllHotelsWithRooms);

export { hotelsRouter };
