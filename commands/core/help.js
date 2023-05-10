const slashHelp = require('../../resources/commands-form/help.js')
const log = require('../../resources/log/log.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
require('dotenv').config();

const execute = async (interaction) => {
    // generate identifier
    const identifier = Math.random().toString(36).substring(2, 8);

    // assign the identifier to the modal
    const modal = helpModalBuilder(identifier)

    // display modal
    await interaction.showModal(modal)

    // modal submit handling
    helpModalSubmit(interaction, identifier)
}

const helpModalSubmit = async (interaction, identifier) => {
    // parse input from form
    let embedProps = {
        season: interaction.options.getString('season'),
        subject: interaction.options.getString('subject'),
        language: interaction.options.getString('language'),
        project: interaction.options.getString('project'),
        attachment: interaction.options.getAttachment('image'),
        userID: interaction.user.id,
    }

    // initialize channel object
    const channel = interaction.client.channels.cache.get(process.env.helpBoardChannelId);

    // filter the modal using the identifier
    const filter = interaction => interaction.customId === identifier

    // wait for modal submit (time out in 5 minutes)
    interaction.awaitModalSubmit({filter, time:300_000})
    .then(async interaction => {
        // parse problem description from modal input
        embedProps["description"] =  interaction.fields.getTextInputValue("descriptionInput")

        // build the ticket embed
        let ticket = ticketEmbedBuilder(embedProps)

        // send ticket to help board
        channel.send({embeds: [ticket.embed], components: [ticket.buttons]})
        await interaction.reply({ content: `Your request has been sent to the guardians!`, ephemeral: true});

    })
    .catch(console.error)
    
    // log interaction using community nickname, use discord username if nickname isnt set 
    const username = await interaction.user.username + "#" + interaction.user.discriminator
    const nickname = await interaction.member.nickname
    const name = (nickname == null) ? username : nickname;
    log(`${name} (${interaction.user.id}) sent a help ticket`)
}

// modal form
const helpModalBuilder = (identifier) => {
    const modal = new ModalBuilder()
        .setCustomId(identifier)
        .setTitle('Problem Description')

    const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel("What is the problem you're experiencing?")
        .setStyle(TextInputStyle.Paragraph);

    const descriptionText = new ActionRowBuilder().addComponents(descriptionInput)

    // Add inputs to the modal
    modal.addComponents(descriptionText);

    // Show the modal to the user
    return modal
}

function ticketEmbedBuilder(props) {
    // deconstruct variables from props (extracted from ticket embed on help board)
    let {userID, season, subject, language, project, description, attachment } = props

    // use default pic if the user doesnt upload an attachment
    let defaultPic = "https://cdn.discordapp.com/attachments/997625130769469481/1091258869071740948/fppsmalllustrewall_textureproduct750x1000.jpg"
    let url = (attachment == null) ? defaultPic : attachment.url

    // build ticket embed
    let embed = new EmbedBuilder()
    .setColor(0x2A9D8F)
    .setAuthor({name: "Help Request"})
	.setTitle(`Project: ${project}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `<@${userID}>`, inline: true },
	)
    .setThumbnail(url)
	.setTimestamp()
	.setFooter({ text: `${season} • ${subject} • ${language}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-claim')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};
}

module.exports = {data: slashHelp, execute: execute }
