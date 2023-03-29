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
                    { name: 'N/A', value: 'n/a'}
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
                    { name: 'N/A', value: 'n/a' }
                )
        )
        .addStringOption(option => 
            option.setName('project')
                .setDescription('Project\'s name (e.g quest 01, my_mastermind, ...')
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
    }
}