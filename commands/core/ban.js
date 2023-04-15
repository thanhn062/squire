const fs = require('fs')
const slashBan = require("../../resources/commands-form/ban.js")
require('dotenv').config();




// Appends the userID to the ban File

const execute = async (interaction) => {
    
    const user = interaction.options.getUser('user')
    if(user.bot){
        await interaction.reply({content: "You cannot select a bot", ephemeral: true})
        return
    }
    console.log("banning user " + user.id)
    fs.appendFileSync("./banFile.txt", user.id + ",")
    global.bannedUsers[user.id] = user.id
    await interaction.reply({content: `Sucessfully banned user <@${user.id}>`, ephemeral: true})

}


const readBanFile = (banFilePath) => {
    const banFile = fs.readFileSync(banFilePath, 'utf-8')
    const bannedUserIDs = banFile.split(",").reduce((a,v) => ({...a,[v] : v}), {})

    return bannedUserIDs
}


module.exports = {data : slashBan, execute: execute, readBanFile: readBanFile}