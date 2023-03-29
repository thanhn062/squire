const { Client, GatewayIntentBits, SlashCommandBuilder, GuildChannel } = require('discord.js');
const jobEmbedBuilder = require('../../resources/embeds/jobEmbed.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('request help from guardians!')
        .addStringOption(option => 
            option.setName('season')
                .setDescription('The season that you\'re on')
                .setRequired(true)
                .addChoices(
                    { name: 'Onboarding', value: 'Onboarding'},
                    { name: 'Preseason', value: 'Preseason'},
                    { name: 'Season 01', value: 'Season 01'},
                    { name: 'Season 02', value: 'Season 02'},
                    { name: 'Season 03', value: 'Season 03'}
                )
        )
        .addStringOption(option => 
            option.setName('subject')
                .setDescription('The subject of the season')
                .setRequired(true)
                .addChoices(
                    { name: 'Arc 01', value: 'Arc 01'},
                    { name: 'Arc 02', value: 'Arc 02'},
                    { name: 'Fullstack', value: 'Fullstack'},
                    { name: 'Frontend', value: 'Frontend'},
                    { name: 'Backend', value: 'Backend'},
                    { name: 'Cloud Engineer', value: 'Cloud'},
                    { name: 'Data Science', value: 'Data'},
                    { name: 'DevOps', value: 'DevOps'},
                    { name: 'Software Engineer', value: 'Software Engineer'},
                    { name: 'Machine Learning', value: 'Machine Learning'},
                    { name: 'N/A', value: 'N/A'}
                )
        )
        .addStringOption(option => 
            option.setName('language')
                .setDescription('The language of the season')
                .setRequired(true)
                .addChoices(
                    { name: 'Javascript', value: 'Javascript' },
                    { name: 'Python', value: 'Python' },
                    { name: 'C', value: 'C' },
                    { name: 'Java', value: 'Java' },
                    { name: 'Golang', value: 'Golang' },
                    { name: 'CPP', value: 'CPP' },
                    { name: 'Rust', value: 'Rust' },
                    { name: 'N/A', value: 'N/A' }
                )
        )
        .addStringOption(option => 
            option.setName('project')
                .setDescription('Project\'s name (e.g quest 01, my_mastermind, ...)')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Describe your roadblock in detail and what you have tried')
                .setRequired(true)
        ),

    async execute(interaction) {
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
}