import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomsByHotels() {
  const hotelsWithRoomsAndReservations = await prisma.$queryRaw`
    SELECT
  h.name as "hotelName",
  h.image as "hotelImage",
  SUM(r.capacity) as "totalCapacity",
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'roomId', r.id,
      'roomName', r.name,
      'roomCapacity', r.capacity,
      'roomBookingCount', COALESCE(subquery.roomBookingCount, 0)
    )
  ) as rooms,
  COALESCE(SUM(subquery.roomBookingCount), 0) as "totalRoomBooking"
FROM
  "Hotel" as h
JOIN
  "Room" as r
ON
  r."hotelId" = h.id
LEFT JOIN LATERAL (
  SELECT
    r2.name as roomName,
    COUNT(*) as roomBookingCount
  FROM "Booking" b
  JOIN "Room" r2 ON b."roomId" = r2.id
  WHERE r2."hotelId" = h.id AND r2.id = r.id
  GROUP BY r2.name
) AS subquery ON true
GROUP BY
  h.name, h.image;
  `;

  return hotelsWithRoomsAndReservations;
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomsByHotels,
};
