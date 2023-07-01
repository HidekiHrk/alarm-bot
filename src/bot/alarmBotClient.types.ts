import type { User } from "discord.js";

export interface ICheckTime {
  hours: number;
  minutes: number;
}

export interface IAlarmBotClientConfig {
  token: string;
  userId: User["id"];
  timeToCheck: ICheckTime;
  retryQuantity?: number; // defaults to 3
  delayBetweenAlarmsInMinutes: number;
  phrases: string[];
  acceptedUserInputsToStop: string[];
}

export type EventMapping = {
  [K: string]: ((...args: any[]) => void)[];
};
