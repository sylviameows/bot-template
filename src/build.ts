/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client, Collection, REST, Routes } from "discord.js";

import fs from "node:fs";
import { client } from ".";
import { BotEvent, Command } from "./types/declarations";
import logger from "./util/logger";

export default async (client: Client) => {
  const token = process.env.TOKEN;
  const appId = process.env.APP;
  if (!token || !appId) {
    throw new Error("Missing token or app id in your .env file.");
  }

  buildEvents();
  client.commands = await buildCommands(token, appId);
  client.cooldown = new Collection();
};

const buildEvents = () => {
  const eventsPath = "src/events";
  fs.readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => `./events/${file}`)
    .forEach((filePath) => {
      import(filePath)
        .then((rawEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const event: BotEvent = rawEvent.default;
          if (event.once)
            client.once(event.type, (...args) => event.run(...args));
          else client.on(event.type, (...args) => event.run(...args));
          logger.info(`Loaded event ${event.type} from ${filePath}.`);
        })
        .catch((e) => {
          logger.error(`Could not load ${filePath}`);
          logger.error(e);
        });
    });
};

const buildCommands = async (token: string, appId: string) => {
  const commands: Collection<string, Command> = new Collection();
  const commandsJSON: unknown[] = [];

  const commandsPath = "src/commands";
  const promises = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => `./commands/${file}`)
    .map((filePath) => {
      return import(filePath)
        .then((rawCommand) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const command: Command = rawCommand.default;
          commands.set(command.name, command);
          commandsJSON.push(command.builder.toJSON());
          logger.info(`Loaded command ${command.name} from ${filePath}.`);
        })
        .catch((e) => {
          logger.error(`Could not load ${filePath}`);
          logger.error(e);
        });
    });

  await Promise.all(promises);

  const rest = new REST({ version: "10" }).setToken(token);
  await rest
    .put(Routes.applicationCommands(appId), { body: commandsJSON })
    .then(() => {
      logger.info(`Successfully deployed commands.`);
    });
  return commands;
};
