import * as dotenv from "dotenv";
import { getConfig } from "./utils/configUtils";

dotenv.config();

export const config = {
  TOKEN: getConfig("TOKEN", String),
  USER_ID: getConfig("USER_ID", String),
  HOURS_TO_CHECK: getConfig("HOURS_TO_CHECK", Number),
  MINUTES_TO_CHECK: getConfig("MINUTES_TO_CHECK", Number),
  RETRY_QUANTITY: getConfig("RETRY_QUANTITY", Number, 3),
  PHRASES: getConfig("PHRASES", Array, ["change message on environment"]),
  ACCEPTED_USER_INPUTS_TO_STOP: getConfig(
    "ACCEPTED_USER_INPUTS_TO_STOP",
    Array,
    ["confirm"]
  ),
  TIMEZONE: getConfig("TIMEZONE", String, "America/Sao_Paulo"),
  DELAY_BETWEEN_ALARMS_IN_MINUTES: getConfig(
    "DELAY_BETWEEN_ALARMS_IN_MINUTES",
    Number,
    3
  ),
};
