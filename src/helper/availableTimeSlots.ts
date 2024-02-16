import moment from "moment-timezone";
import { Availability } from "@prisma/client";
import { AvailabilityDay } from "./constant";
import { CalendarEvent } from "../graphql/generated";

type Slot = {
  start_time: Date;
  end_time: Date;
};

type GroupedSlots = {
  [day_of_week: string]: Slot[];
};

export function findIntersectingIntervals(slots: Slot[]) {
  slots.sort((a, b) => {
    if (moment(a.start_time, "h:mma").isBefore(moment(b.start_time, "h:mma")))
      return -1;
    if (moment(a.start_time, "h:mma").isAfter(moment(b.start_time, "h:mma")))
      return 1;
    return 0;
  });

  const result: typeof slots = [];

  if (slots.length === 1) {
    result.push(slots[0]);
  } else {
    for (let i = 0; i < slots.length - 1; i++) {
      const interval1 = slots[i];
      const interval2 = slots[i + 1];
      const start1 = moment(interval1.start_time);
      const end1 = moment(interval1.end_time);
      const start2 = moment(interval2.start_time);
      const end2 = moment(interval2.end_time);

      const maxStart = moment.max(start1, start2);
      const minEnd = moment.min(end1, end2);

      if (maxStart.isBefore(minEnd)) {
        result.push({
          start_time: maxStart.toDate(),
          end_time: minEnd.toDate(),
        });
      }
    }
  }

  return result;
}

export const generateDates = (from: Date, to: Date) => {
  const startDate = moment(from);
  const endDate = moment(to);
  const dateArr: string[] = [];
  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    dateArr.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "days");
  }
  return dateArr;
};

export const generateCommonAvailableSlots = (
  groupedAvailability: GroupedSlots
) => {
  return Object.values(AvailabilityDay).reduce<GroupedSlots>((acc, cur) => {
    const dayIntervals = groupedAvailability[cur];
    if (dayIntervals === undefined) {
      return { ...acc, [cur]: [] };
    }
    // Generate free slot
    const freeSlots = dayIntervals.reduce<
      { start_time: Date; end_time: Date }[]
    >((slotsAcc, interval) => {
      let slots = [];
      let start = moment(interval.start_time);
      if (start.get("minute") < 30) {
        start.minute(0);
      } else {
        start.minute(30);
      }
      let end = start.clone().add(30, "minutes");
      let endOfAvailableDay = moment(interval.end_time);
      while (start.isBefore(endOfAvailableDay)) {
        slots.push({
          start_time: start.toDate(),
          end_time: end.toDate(),
        });

        start.add(30, "minutes");
        end.add(30, "minutes");
      }

      return [...slotsAcc, ...slots];
    }, []);

    const draft = { ...acc, [cur]: freeSlots };
    return draft;
  }, {});
};

export const filterAvailableSlotsByDuration = (
  groupedCommonAvailableSlots: GroupedSlots,
  durationInMin: number
) => {
  return Object.values(AvailabilityDay).reduce<GroupedSlots>((acc, cur) => {
    const slots = groupedCommonAvailableSlots[cur];
    if (slots === undefined) {
      return { ...acc, [cur]: [] };
    }

    const filteredSlots: { start_time: Date; end_time: Date }[] = [];

    for (let i = 0; i < slots.length; i++) {
      let currentSlot = slots[i];
      let endTimeForDuration = moment(currentSlot.start_time).add(
        durationInMin,
        "minutes"
      );

      // Check if the duration fits in the consecutive free slots
      let fitsDuration = false;
      for (let j = i; j < slots.length; j++) {
        if (endTimeForDuration.isSameOrBefore(slots[j].end_time)) {
          fitsDuration = true;
          break;
        }
      }

      if (fitsDuration) {
        filteredSlots.push(currentSlot);
      }
    }
    const draft = { ...acc, [cur]: filteredSlots };
    return draft;
  }, {});
};

type UserCalendarData = {
  userId: string;
  calendarEvents: CalendarEvent[];
};

export const generateCalendarEventBusySlots = (
  userCalendarData: UserCalendarData[]
): Slot[] => {
  return userCalendarData.reduce<{ start_time: Date; end_time: Date }[]>(
    (acc, eventData) => {
      const { calendarEvents } = eventData;
      const busySlots: { start_time: Date; end_time: Date }[] = [];
      calendarEvents.forEach((event) => {
        const current = event.timezone
          ? moment.tz(event.start_time, event.timezone)
          : moment.tz(event.start_time);

        const eventEndTime = event.timezone
          ? moment.tz(event.end_time, event.timezone)
          : moment.tz(event.end_time);

        while (current.isBefore(eventEndTime)) {
          let end = current.clone().add(30, "minutes");

          if (end.isAfter(eventEndTime)) {
            end = moment(eventEndTime);
          }

          busySlots.push({
            start_time: current.toDate(),
            end_time: end.toDate(),
          });
          current.add(30, "minutes");
        }
      });

      return [...acc, ...busySlots];
    },
    []
  );
};
