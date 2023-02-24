/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionResolvable,
} from "discord.js";

/**
 * Represents a command.
 * @param {string} name - The name of the command.
 * @param {string} description - The descrtiption of the command.
 * @param {PermissionResolvable} permission - The permission required for the bot to run the command.
 * @param {string} usage - How to use the command. For help command.
 * @param {method} run - What runs when the command is used.
 * @param {method} autocomplete - What runs when autocomplete is enabled.
 * @param {SlashCommandBuilder} builder - What is used to deploy the command.
 */
declare interface Command {
  name: string;
  description: string;
  usage: string;
  permission?: PermissionResolvable;
  cooldown?: number;

  run(i: ChatInputCommandInteraction): Promise<void>;
  autocomplete?(i: AutocompleteInteraction): Promise<void>;
  builder: any;
}

/**
 * Represents an event.
 * @param {Events} type - The type of event this runs on.
 * @param {boolean} once - If this event only runs once. (optional)
 * @param {method} run - Runs when the event is called.
 */
declare interface BotEvent {
  type: string;
  once?: boolean;
  run(...args: any): void;
}
