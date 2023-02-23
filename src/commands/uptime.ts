import { SlashCommandBuilder, time } from "discord.js";
import { client } from "..";
import { Command } from "../types/declarations";


const data: Command = {
  name: "uptime",
  description: "Get the bots uptime.",
  usage: "/uptime",

  run: async (i) => {
    const uptime = client.uptime
    const timestamp = client.readyTimestamp
    if (!uptime || !timestamp) {
      throw new Error("Uptime/timestamp is missing from the client ")
    }

    const moment = require("moment");
    require("moment-duration-format");
    const duration = moment.duration(uptime).format(" D [days], H [hrs], m [mins], s [secs]")

    i.reply({
      content: `:stopwatch: Uptime: \`${duration}\`` // optional addition for a timestamp: \n${time((Math.floor(timestamp/1000)), 'f')}
    })
  },
  builder: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Get the bots uptime.")
}

export default data