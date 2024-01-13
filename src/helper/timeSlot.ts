import moment from "moment";
import { CalendarEvent } from "../graphql/generated";

type TimeSlot = {
  start: Date;
  end: Date;
};

type Availability = { day_of_week: string; start_time: string; end_time: string };

export const processCalendarEvents = (events: CalendarEvent[]): TimeSlot[] => {
  let busySlots: TimeSlot[] = [];

  for (const event of events) {
    let current = moment(event.start_time);

    while (current.isBefore(event.end_time)) {
      let end = current.clone().add(30, 'minutes');

      if (end.isAfter(event.end_time)) {
        end = moment(event.end_time);
      }

      busySlots.push({ start: current.toDate(), end: end.toDate() });
      current.add(30, 'minutes');
    }
  }

  return busySlots;
}

export const generateAllSlotsForDay = (
  date: Date,
  availability: Availability[]
): TimeSlot[] => {
  const targetDate = moment(date);
  let slots: TimeSlot[] = [];

  availability
    .filter((a) => a.day_of_week === targetDate.format("dddd"))
    .forEach((a) => {
      let start = moment(
        `${targetDate.format("MM-DD-YYYY")} ${a.start_time}`,
        "MM-DD-YYYY h:mma"
      );
      if (start.get("minute") < 30) {
        start.minute(0);
      } else {
        start.minute(30);
      }
      let end = start.clone().add(30, "minutes");
      let endOfAvailableDay = moment(
        `${targetDate.format("MM-DD-YYYY")} ${a.end_time}`,
        "MM-DD-YYYY h:mma"
      );
      while (start.isBefore(endOfAvailableDay)) {
        slots.push({ start: start.toDate(), end: end.toDate() });

        start.add(30, "minutes");
        end.add(30, "minutes");
      }
    });

  return slots;
};

export const findFreeSlots = (
  busySlots: TimeSlot[],
  availability: Availability[],
  date: Date,
  duration_in_min: number
): Date[] => {
  let allSlots = generateAllSlotsForDay(date, availability);
  let freeSlots: TimeSlot[] = [];
  let availableStartTimes: Date[] = [];

  // Identifying free slots
  for (const slot of allSlots) {
    let isBusy = busySlots.some(
      (busySlot) =>
        moment(busySlot.start).isBefore(slot.end) &&
        moment(busySlot.end).isAfter(slot.start)
    );

    if (!isBusy) {
      freeSlots.push(slot);
    }
  }

  // Filtering slots based on the required duration
  for (let i = 0; i < freeSlots.length; i++) {
    let currentSlot = freeSlots[i];
    let endTimeForDuration = moment(currentSlot.start).add(
      duration_in_min,
      "minutes"
    );

    // Check if the duration fits in the consecutive free slots
    let fitsDuration = true;
    for (let j = i; j < freeSlots.length; j++) {
      if (endTimeForDuration.isSameOrBefore(freeSlots[j].end)) {
        break;
      }
      if (
        j + 1 < freeSlots.length &&
        moment(freeSlots[j].end).isBefore(freeSlots[j + 1].start)
      ) {
        fitsDuration = false;
        break;
      }
    }

    if (fitsDuration) {
      availableStartTimes.push(currentSlot.start);
    }
  }

  return availableStartTimes;
};

export const intersectSlots = (slots1: Date[], slots2: Date[]): Date[] => {
  let intersection: Date[] = [];

  slots1.forEach(slot1 => {
    slots2.forEach(slot2 => {
      if (moment(slot1).isSame(slot2)) {
        intersection.push(slot1);
      }
    });
  });

  return intersection;
}

export const findCommonFreeSlotsForAllUser = (freeSlotsGroupByUser: Date[][]): Date[] => {
  if (freeSlotsGroupByUser.length === 0) return [];

  // Start with the free slots of the first user
  let commonSlots = freeSlotsGroupByUser[0];

  // Intersect with the free slots of each subsequent user
  for (let i = 1; i < freeSlotsGroupByUser.length; i++) {
    commonSlots = intersectSlots(commonSlots, freeSlotsGroupByUser[i]);
  }

  return commonSlots;
}
