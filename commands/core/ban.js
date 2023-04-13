const fs = require('fs')
const slashBan = require("../../resources/commands-form/ban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const userID = interaction.options.getString('userID')

    writeBanFile(userID)
    await interaction.reply({content: `Sucessfully banned user ${userID}`, ephemeral: true})

}


const writeBanFile = (userID) => {
    const path = '../../banFile.txt'
    fs.appendFileSync(path, userID + ",")

}

const readBanFile = (path) => {
    const banFile = fs.readFileSync(path, 'utf-8')
    const bannedUserIDs = banFile.split(",").reduce((a,v) => ({...a,[v] : v}), {})

    return bannedUserIDs
}


module.exports = {data : slashBan, execute: execute, readBanFile: readBanFile}