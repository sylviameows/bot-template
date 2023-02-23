import { ActivityType, CommandInteraction, Events, Interaction } from "discord.js";
import { client } from "..";
import { BotEvent } from "../types/declarations";
import logger from "../util/logger";

const data: BotEvent = {
  type: Events.InteractionCreate,
  run: async (i: Interaction) => {

    if (i.isAutocomplete()) {
      const command = i.client.commands.get(i.commandName)
      if (!command || !command.autocomplete) {
        logger.error(`Command ${i.commandName} does not exist or doesn't have an autocomplete function.`)
        return
      }

      try {
        await command.autocomplete(i)
      } catch (e) {
        logger.error(e)
      }
    }

    if (i.isChatInputCommand()) {
      const command = i.client.commands.get(i.commandName)
      if (!command) {
        i.reply({content: "The command you're trying to run does not exist, contact the bot developer if you think this is an error.", ephemeral: true})
        logger.warn(`Command ${i.commandName} does not exist, this may be an issue or a command may not have been deleted.`)
        return
      }

      try {
        await command.run(i)
      } catch (e) {
        logger.error(e)

        await i.reply({
          content: 'There was an issue running this command!',
          ephemeral: true
        }).catch(() => {
          i.editReply({content: 'There was an issue running this command!'})
        })
      }

      return
    }

  }
}

export default data