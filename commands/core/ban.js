const fs = require('fs')
const slashBan = require("../../resources/commands-form/ban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const userID = interaction.options.getString('userid')
    console.log(userID)

    writeBanFile(userID)
    await interaction.reply({content: `Sucessfully banned user <@${userID}>`, ephemeral: true})

}


const writeBanFile = (userID) => {

    fs.appendFileSync("./banFile.txt", userID + ",")
}

const readBanFile = (banFilePath) => {
    const banFile = fs.readFileSync(banFilePath, 'utf-8')
    const bannedUserIDs = banFile.split(",").reduce((a,v) => ({...a,[v] : v}), {})

    return bannedUserIDs
}


module.exports = {data : slashBan, execute: execute, readBanFile: readBanFile}