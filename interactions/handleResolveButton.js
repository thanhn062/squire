const {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

const tags = require('../resources/forum_tag_ids.js')
require('dotenv').config();


// when a user clicks resolve, a modal pops prompting the user to enter what the problem and solution was
// then, the job posting is deleted from the job board, and a thread is created on the forum where the problem and solution is able to be viewed
const handleResolveButton = async (interaction) => {

    const modal = resolveModalBuilder()

    await interaction.showModal(modal);

    resolveModalSubmit(interaction)
    
}

const resolveModalBuilder = () => {
    const modal = new ModalBuilder()
        .setCustomId('resolve-modal')
        .setTitle('Ticket Resolution');

    const problemInput = new TextInputBuilder()
        .setCustomId('problemInput')
        .setLabel("What was the problem they encountered?")
        .setStyle(TextInputStyle.Paragraph);

    const solutionInput = new TextInputBuilder()
        .setCustomId('solutionInput')
        .setLabel("How did you resolve this ticket?")
        .setStyle(TextInputStyle.Paragraph);
    
    const problemText = new ActionRowBuilder().addComponents(problemInput)
    const solutionText = new ActionRowBuilder().addComponents(solutionInput)

    // Add inputs to the modal
    modal.addComponents(problemText, solutionText);

    // Show the modal to the user
    return modal
}

const resolveModalSubmit = async interaction => {
    const messageID = interaction.customId.split("-")[2]
    const channel = interaction.client.channels.cache.get(process.env.helpBoardChannelId);
    const embed = interaction.message.embeds[0]
    const resolvedTicket = {}
    const filter = interaction => interaction.customId === "resolve-modal"

    interaction.awaitModalSubmit({filter, time:300_000})
    .then(async interaction => {
        resolvedTicket["problem"] = interaction.fields.getTextInputValue("problemInput")
        resolvedTicket["solution"] = interaction.fields.getTextInputValue("solutionInput")

        // delete ticket on help board
        channel.messages.fetch(messageID).then(message => message.delete()).catch(console.error)

        // update ticket in guardian's DM
        interaction.update({components: [], content: "\`Ticket resolved! Thanks for your help.\`"})

        // get resolved board channel by channel Id
        const resolvedBoard = interaction.client.channels.cache.get(process.env.resolvedTicketsChannelId)
        
        // parse ticket's footer and convert to forum tags
        const allTags = await resolvedBoard.availableTags;
        const forumTags = embed.footer.text.split(" • ").map(tagName => {
            // Find the tag with the matching name
            const tag = allTags.find(t => t.name === tagName);
            // Return the tag ID, or null if the tag isn't found
            return tag ? tag.id : null
        });

        // create the thread
        const thread = await resolvedBoard.threads.create({
           name: `${embed.data.title}`, 
           message: {embeds: [embed]}, 
           appliedTags: forumTags
        })

        // send summary of problem and solution to the thread as comment
       thread.send(`> Problem Encountered\n\`\`\`${resolvedTicket.problem}\`\`\`\n> Solution\n\`\`\`${resolvedTicket.solution}\`\`\``)
    })
    .catch(console.error)
}

module.exports = handleResolveButton