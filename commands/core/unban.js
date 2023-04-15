const fs = require('fs')
const slashUnBan = require("../../resources/commands-form/unban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const user = interaction.options.getUser('user')
    if(user.bot){
        await interaction.reply({content: "You cannot select a bot", ephemeral: true})
        return
    }
    console.log(`Unbanning user ${user.id}`)
    
    const bannedUsers = readBanFile("./banFile.txt").filter(x => x !== user.id).join(",")

    fs.writeFileSync("./banFile.txt", bannedUsers, {flag: 'w+'})
    delete global.bannedUsers[user.id]
    await interaction.reply({content: `Sucessfully unbanned user <@${user.id}>`, ephemeral: true})

}


const readBanFile = (banFilePath) => {
    const banFile = fs.readFileSync(banFilePath, 'utf-8')
    const bannedUserIDs = banFile.split(",")

    return bannedUserIDs
}




module.exports = {data : slashUnBan, execute: execute}