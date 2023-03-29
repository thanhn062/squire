// const { REST, Routes } = require('discord.js');

// const commands = [
//   {
//     name: 'ping',
//     description: 'Replies with Pong!',
//   },
// ];

// TOKEN = "MTA5MDQ2ODA0ODU2MzA5MzUwNA.G1Ld-b.svL1XvZe-M2zKrVtevhWqZAtcDSF6EgbO9wJIU";
// const rest = new REST({ version: '10' }).setToken(TOKEN);

// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();
require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js

const client = new Discord.Client(); //create new client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token