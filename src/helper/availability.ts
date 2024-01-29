import { Prisma } from "@prisma/client";
import { AvailabilityDay } from "./constant";

export const availabilitiesCreateData = (
  tz: string,
  userId: string
): Prisma.AvailabilityCreateManyInput[] => {
  return [
    AvailabilityDay.MONDAY,
    AvailabilityDay.TUESDAY,
    AvailabilityDay.WEDNESDAY,
    AvailabilityDay.THURSDAY,
    AvailabilityDay.FRIDAY,
  ].map((day) => ({
    user_id: userId,
    day_of_week: day,
    start_time: "9:00am",
    end_time: "5:00pm",
    timezone: tz,
  }));
};
