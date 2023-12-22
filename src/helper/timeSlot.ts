import moment from "moment";
import { CalendarEvent } from "../graphql/generated";

type TimeSlot = {
  start: Date;
  end: Date;
};

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

export const generateAllSlotsForDay = (date: Date): TimeSlot[] => {
  let slots: TimeSlot[] = [];
  let start = moment(date).hours(9).minutes(0).seconds(0).milliseconds(0); // Starts at 9am
  let end = start.clone().add(30, 'minutes');
  let endOfWorkDay = moment(date).hours(17).minutes(0).seconds(0).milliseconds(0); // Ends at 5pm

  while (start.isBefore(endOfWorkDay)) {
    slots.push({ start: start.toDate(), end: end.toDate() });

    start.add(30, 'minutes');
    end.add(30, 'minutes');
  }

  return slots;
}

export const findFreeSlots = (busySlots: TimeSlot[], date: Date, duration_in_min: number): Date[] => {
  let allSlots = generateAllSlotsForDay(date);
  let freeSlots: TimeSlot[] = [];
  let availableStartTimes: Date[] = [];

  // Identifying free slots
  for (const slot of allSlots) {
    let isBusy = busySlots.some(busySlot =>
      moment(busySlot.start).isBefore(slot.end) && moment(busySlot.end).isAfter(slot.start)
    );

    if (!isBusy) {
      freeSlots.push(slot);
    }
  }

  // Filtering slots based on the required duration
  for (let i = 0; i < freeSlots.length; i++) {
    let currentSlot = freeSlots[i];
    let endTimeForDuration = moment(currentSlot.start).add(duration_in_min, 'minutes');

    // Check if the duration fits in the consecutive free slots
    let fitsDuration = true;
    for (let j = i; j < freeSlots.length; j++) {
      if (endTimeForDuration.isSameOrBefore(freeSlots[j].end)) {
        break;
      }
      if (j + 1 < freeSlots.length && moment(freeSlots[j].end).isBefore(freeSlots[j + 1].start)) {
        fitsDuration = false;
        break;
      }
    }

    if (fitsDuration) {
      availableStartTimes.push(currentSlot.start);
    }
  }

  return availableStartTimes;
}

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
