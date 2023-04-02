const tags = require('../resources/forum_tag_ids.js')
require('dotenv').config();


// when user click resolve
// extract msgURL from customID
// edit help ticket on job board to put back the Claim / Deny buttons
// and also edit component from guardian & student DM to Complete
// and also delete it from help board
const handleResolveButton = async (interaction) => {

    const messageID = interaction.customId.split("-")[2]
    const channel = interaction.client.channels.cache.get(process.env.helpBoardChannelId);
    const embed = interaction.message.embeds[0]

    channel.messages.fetch(messageID).then(message => message.delete()).catch(console.error)
    interaction.update({components: [], content: "\`Ticket resolved! Thanks for your help.\`"})

    const resolvedBoard = interaction.client.channels.cache.get(process.env.resolvedTicketsChannelId)
    const forumTags = embed.footer.text.split(" • ")
    console.log(forumTags)

    let forumTagIds = forumTags.map(tag => tags[tag])

    resolvedBoard.threads.create({name: `Resolved Ticket for ${embed.data.title}`, message: { embeds: [embed]}, appliedTags: forumTagIds})
    
    


}

module.exports = handleResolveButton