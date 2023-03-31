const { SlashCommandBuilder } = require('discord.js');


const testSlashHelp = new SlashCommandBuilder()
        .setName('testhelpconnor')
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
        )

module.exports = testSlashHelp