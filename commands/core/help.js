const { Client, GatewayIntentBits, SlashCommandBuilder, GuildChannel } = require('discord.js');
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
                    { name: 'Onboarding', value: 'onboarding'},
                    { name: 'Preseason', value: 'preseason'},
                    { name: 'Season 01', value: 'season01'},
                    { name: 'Season 02', value: 'season02'},
                    { name: 'Season 03', value: 'season03'}
                )
        )
        .addStringOption(option => 
            option.setName('subject')
                .setDescription('The subject of the season')
                .setRequired(true)
                .addChoices(
                    { name: 'Arc 01', value: 'arc01'},
                    { name: 'Arc 02', value: 'arc02'},
                    { name: 'Fullstack', value: 'fullstack'},
                    { name: 'Frontend', value: 'frontend'},
                    { name: 'Backend', value: 'backend'},
                    { name: 'Cloud Engineer', value: 'cloud'},
                    { name: 'Data Science', value: 'data'},
                    { name: 'DevOps', value: 'devops'},
                    { name: 'Software Engineer', value: 'software engineer'},
                    { name: 'Machine Learning', value: 'machine learning'},
                    { name: 'None Applicable', value: 'none'}
                )
        )
        .addStringOption(option => 
            option.setName('language')
                .setDescription('The language of the season')
                .setRequired(true)
                .addChoices(
                    { name: 'Javascript', value: 'javascript' },
                    { name: 'Python', value: 'python' },
                    { name: 'C', value: 'c' },
                    { name: 'Java', value: 'java' },
                    { name: 'Golang', value: 'golang' },
                    { name: 'CPP', value: 'cpp' },
                    { name: 'Rust', value: 'rust' },
                    { name: 'None Applicable', value: 'none' }
                )
        )
        .addStringOption(option => 
            option.setName('other')
                .setDescription('Project\'s name (e.g quest 01, my_mastermind, ...')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Describe your roadblock in details and what have you tried')
                .setRequired(true)
        ),
    async execute(interaction) {
        const season = interaction.options.getString('season');
        const subject = interaction.options.getString('subject');
        const language = interaction.options.getString('language');
        const other = interaction.options.getString('other');
        const description = interaction.options.getString('description');
        const channel = interaction.client.channels.cache.get('1090527860206342256');
        const userID = interaction.user.id;

        // channel.send(`From: <@${userID}>\n${season}`);

        channel.send(`From: <@${userID}>\n${season}\n${subject}\n${language}\n${other}\nproblem: ${description}`);
		await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});
    }
}