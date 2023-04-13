// dependencies
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const handleClaimButton = require("./interactions/handleClaimButton.js")
const handleDenyButton = require("./interactions/handleDenyButton.js")
const handleResolveButton = require("./interactions/handleResolveButton.js")
const handleUnclaimButton = require("./interactions/handleUnclaimButton.js")
const {readBanFile} = require("./commands/core/ban.js")

if(!fs.existsSync(path)){
	console.log("Ban File doesn't exist, creating one")
	fs.writeFileSync(path,"")
}

const bannedUsers = readBanFile("./banFile.txt")


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
	if(interaction.user.id in bannedUsers){
		await interaction.reply({content: "You have been banned from Squire, please contact your community manager.", ephemeral: true})
		return
	}
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

function deleteTicket() {
	const channel = client.channels.cache.get(process.env.helpBoardChannelId);
	if (!channel) return;

	// Delete all help tickets older than 3 days
	const day = 3;
	const livespan = day * 24;

	// scan the last 100 messages in help board
	// assuming there will never be more than 100 tickets in the help board
	channel.messages.fetch({ limit: 100 }).then(messages => {
		messages.forEach(async message => {
			// only check for message with embeds with timestamp
			if (message.embeds[0] != null && message.embeds[0].data.timestamp != null) {
				const isoString = await message.embeds[0].data.timestamp;
				const msg_date = new Date(isoString);
				const current_date = new Date();
				const diffInMs = current_date - msg_date; // Difference in milliseconds
				const diffInHrs = Math.round(diffInMs / 3600000); // Difference in hours
				console.log(diffInHrs)
				// delete help ticket more than 3 days old
				if (diffInHrs >= livespan) {
					message.delete()
						.then(console.log(`Deleted message ${message.id}`))
						.catch(console.error);
					// send ticket timeout message to student
					const student_discord_id = message.embeds[0].data.fields[0].value.substring(2,20);
					const guild = await client.guilds.fetch(process.env.guildId);
					const member = await guild.members.fetch(student_discord_id);
					const user = await member.user.fetch();
					const dmChannel = await user.createDM();
					dmChannel.send({content: '```fix\nUnfortunately, your help ticket has timed out as no guardian was available to address this problem. Please feel free to submit a new help ticket if you need further assistance. Thank you for your understanding.```'});
				}
			}
		})
	}).catch(console.error);
}

// Client login
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	// set ticket delete timer
	setInterval(deleteTicket, 1620000);
});

client.login(process.env.CLIENT_TOKEN);
