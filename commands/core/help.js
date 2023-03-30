//const { Client, GatewayIntentBits, SlashCommandBuilder, GuildChannel } = require('discord.js');
const jobEmbedBuilder = require('../../resources/embeds/jobEmbed.js');
const slashHelp = require('../../resources/slash-commands/slash-help')
require('dotenv').config();

const execute = async (interaction) => {
    let embedProps = {
        season: interaction.options.getString('season'),
        subject: interaction.options.getString('subject'),
        language: interaction.options.getString('language'),
        project: interaction.options.getString('project'),
        description: interaction.options.getString('description'),
        userID: interaction.user.id,
    }
    const channel = interaction.client.channels.cache.get('1090527860206342256');
    let jobPost = jobEmbedBuilder(embedProps)
    channel.send({embeds: [jobPost.embed], components: [jobPost.buttons]})
    await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});
    
    // Handle button click events
    interaction.client.on('interactionCreate', async interaction => {
        if (interaction.isButton() && interaction.customId === 'button-claim') {
            const student_discord = jobPost.embed.data.fields[0].value;
            const student_discord_id = student_discord.substring(2, student_discord.length - 1)
            console.log(typeof student_discord_id)
            // const student_discord_id = await embedProps.userID;
            const guardian_discord_id = await interaction.user.id;
            console.log("guardian discord id type is: ", typeof guardian_discord_id)
            console.log(student_discord);
            console.log("student: " + student_discord_id)
            console.log("guardian: " + guardian_discord_id)
            if (student_discord_id.toString() === guardian_discord_id.toString()) {
                console.log("Guardian tried to claim own ticket!")
                interaction.reply({ content: "You cannot claim your own ticket.", ephemeral: true});
                return;
            }
            else {
                console.log("Ticket claimed! Sending messages to student and guardian")
                const messageContent = "this is a test";

                // DM Guardian
                const member = await interaction.guild.members.fetch(guardian_discord_id);
                const user = await member.user.fetch();
                const dmChannel = await user.createDM();
                dmChannel.send({ content: messageContent });

                // DM Student
                const member2 = await interaction.guild.members.fetch(student_discord_id);
                const user2 = await member2.user.fetch();
                const dmChannel2 = await user2.createDM();
                dmChannel2.send({ content: messageContent });
            }
        }
    });
}

module.exports = {data: slashHelp, execute}
