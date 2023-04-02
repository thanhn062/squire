// dependencies
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const handleClaimButton = require("./interactions/handleClaimButton.js")
const handleDenyButton = require("./interactions/handleDenyButton.js")
const handleResolveButton = require("./interactions/handleResolveButton.js")
const handleUnclaimButton = require("./interactions/handleUnclaimButton.js")
// configuration
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// dynamically load command files
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// button listener
client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isButton()) return

	if(interaction.customId == "button-claim"){
		handleClaimButton(interaction)
		return
	}
	if(interaction.customId == "button-deny"){
		handleDenyButton(interaction)
		return
	}
	if(interaction.customId.startsWith("button-resolve")){
		handleResolveButton(interaction)
		return
	}
	if(interaction.customId.startsWith("button-unclaim")){
		handleUnclaimButton(interaction)
		return
	}
})


// slash command listener
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Client login
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.CLIENT_TOKEN);
