import { AlarmBotClient } from "./bot/alarmBotClient";
import { config } from "./config";

function main(): number {
  const client = new AlarmBotClient({
    token: config.TOKEN,
    userId: config.USER_ID,
    delayBetweenAlarmsInMinutes: config.DELAY_BETWEEN_ALARMS_IN_MINUTES,
    timeToCheck: {
      hours: config.HOURS_TO_CHECK,
      minutes: config.MINUTES_TO_CHECK,
    },
    phrases: config.PHRASES,
    acceptedUserInputsToStop: config.ACCEPTED_USER_INPUTS_TO_STOP,
  });

  client.start();

  return 0;
}

main();
