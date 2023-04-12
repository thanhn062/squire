const fs = require('fs')
const slashBan = require("../../resources/commands-form/ban.js")
require('dotenv').config();


const path = '../banFile.txt'

// Appends the userID to the ban File

const execute = async (interaction) => {
    const admins = process.env.adminuserIDs.split(",")
    if(!admins.includes(interaction.user.id)){
        interaction.reply({content: "You do not have permission to ban users", ephemeral: true })
        return
    }
    
    const userID = interaction.options.getString('userID')
    writeBanFile(userID)

    await interaction.reply({content: `Sucessfully banned user ${userID}`, ephemeral: true})

    
}


const writeBanFile = (userID) => {
    if(!fs.existsSync(path)){
        console.log("Ban File doesn't exist, creating one")
        fs.writeFileSync(path,"")
    }

    fs.appendFileSync(path, userID + ",")

}




module.exports = {data : slashBan, execute: execute}