import { Client, GatewayIntentBits } from "discord.js";

import "dotenv/config";
import build from "./build";
import logger from "./util/logger";

export const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

void build(client)
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .then(() => {
    void client.login(process.env.TOKEN);
  });
