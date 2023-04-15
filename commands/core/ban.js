const fs = require('fs')
const slashBan = require("../../resources/commands-form/ban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const userID = interaction.options.getUser('user')
    console.log("banning user " + userID)
    fs.appendFileSync("./banFile.txt", userID + ",")
    global.bannedUsers[userID] = userID
    await interaction.reply({content: `Sucessfully banned user <@${userID}>`, ephemeral: true})

}


const readBanFile = (banFilePath) => {
    const banFile = fs.readFileSync(banFilePath, 'utf-8')
    const bannedUserIDs = banFile.split(",").reduce((a,v) => ({...a,[v] : v}), {})

    return bannedUserIDs
}


module.exports = {data : slashBan, execute: execute, readBanFile: readBanFile}