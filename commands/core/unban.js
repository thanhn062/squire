const fs = require('fs')
const slashUnBan = require("../../resources/commands-form/unban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const userID = interaction.options.getUser('user')
    console.log(`Unbanning user ${userID}`)
    
    const bannedUsers = readBanFile("./banFile.txt").filter(x => x !== userID).join(",")

    fs.writeFileSync("./banFile.txt", bannedUsers, {flag: 'w+'})
    delete global.bannedUsers[userID]
    await interaction.reply({content: `Sucessfully unbanned user <@${userID}>`, ephemeral: true})

}


const readBanFile = (banFilePath) => {
    const banFile = fs.readFileSync(banFilePath, 'utf-8')
    const bannedUserIDs = banFile.split(",")

    return bannedUserIDs
}




module.exports = {data : slashUnBan, execute: execute}