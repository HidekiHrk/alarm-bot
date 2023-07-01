import moment from "moment-timezone";
import { config } from "../config";

export function getCurrentHours(timezone = config.TIMEZONE) {
  const currentHoursString = moment().tz(timezone).format("HH:mm");
  const [hours, minutes] = currentHoursString
    .split(":")
    .map((value) => parseInt(value));
  return {
    hours,
    minutes,
  };
}
