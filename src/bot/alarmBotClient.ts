import { Client, GatewayIntentBits, Partials } from "discord.js";
import type { Message } from "discord.js";
import type {
  EventMapping,
  IAlarmBotClientConfig,
} from "./alarmBotClient.types";
import { getCurrentHours } from "../utils/timezoneUtils";

export class AlarmBotClient extends Client {
  private config: Readonly<IAlarmBotClientConfig>;
  private disarmed = false;

  constructor(config: IAlarmBotClientConfig) {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [Partials.Channel],
    });
    this.config = Object.freeze({
      retryQuantity: 3,
      ...config,
      timeToCheck: { ...config.timeToCheck },
      phrases: [...(config.phrases ?? [])],
      acceptedUserInputsToStop: [...(config.acceptedUserInputsToStop ?? [])],
    });
    this.configure();
  }

  get Config() {
    return this.config;
  }

  private configure() {
    const events: EventMapping = {
      ready: [this.onReady],
      messageCreate: [this.onMessage],
    };

    for (const [eventName, listeners] of Object.entries(events)) {
      for (const listener of listeners) {
        this.on(eventName, listener);
      }
    }
  }

  private async getCurrentUser() {
    try {
      const user = await this.users.fetch(this.config.userId);
      return user;
    } catch (err) {
      return null;
    }
  }

  start() {
    this.login(this.config.token);
  }

  private onReady() {
    console.log(
      `Bot Online!\nID: ${this?.user?.id}\nName: ${this?.user?.username}`
    );
    this.startCheckingDaemon();
  }

  private onMessage(message: Message) {
    if (message.author?.id !== this.config.userId) return;
    const content = message.content?.trim?.()?.toLowerCase?.() ?? "";
    const canDisarm = this.config.acceptedUserInputsToStop
      .map((value) => value.toLowerCase())
      .includes(content);
    if (canDisarm) {
      console.log("Disarmed!");
      this.disarmed = true;
    }
  }

  private verifyHours() {
    const current = getCurrentHours();
    if (current.hours < this.config.timeToCheck.hours) return false;
    if (
      current.hours === this.config.timeToCheck.hours &&
      current.minutes >= this.config.timeToCheck.minutes
    )
      return true;
    if (current.hours > this.config.timeToCheck.hours) return true;
    return false;
  }

  private getAlarmMessageContentToSend() {
    const contents = this.config.phrases ?? [];
    const randomIndex = Math.round(Math.random() * (contents.length - 1));
    return contents[randomIndex];
  }

  private startCheckingDaemon() {
    let delayMinutes: number | null = null;
    const check = async (): Promise<any> => {
      console.log("Checking", new Date().toISOString());
      const valid = this.verifyHours();
      if (!valid) {
        console.log("Not in the hour");
        if (this.disarmed) {
          this.disarmed = false;
          console.log("Armed again!");
        }
        return;
      }
      if (this.disarmed) return console.log("Already Disarmed!");
      if (delayMinutes !== null) {
        if (delayMinutes > 0) return delayMinutes--;
        else if (delayMinutes <= 0) delayMinutes = null;
      }
      const user = await this.getCurrentUser();
      if (!user) return console.log("User not found");
      await user.send(this.getAlarmMessageContentToSend());
      console.log("Message sent!");
      delayMinutes = this.config.delayBetweenAlarmsInMinutes;
    };
    check();
    setInterval(check, 60000);
  }
}
