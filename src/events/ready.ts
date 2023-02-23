import { ActivityType, Events } from "discord.js";
import { client } from "..";
import { BotEvent } from "../types/declarations";
import logger from "../util/logger";

const data: BotEvent = {
  type: Events.ClientReady,
  once: true,
  run: async () => {
    if (!client.user || !client.application) {
      throw new Error("Issue during startup, missing client.")
    };

    logger.success(`Ready as ${client.user.tag}.`)

    client.user.presence.set({ // docs: https://discord.js.org/#/docs/main/stable/typedef/PresenceData
      activities: [{ // docs: https://discord.js.org/#/docs/main/stable/typedef/ActivitiesOptions
        name: `${client.guilds.cache.size} servers`,
        type: ActivityType.Listening,
      }],
      status: 'online',
    });
  }
}

export default data