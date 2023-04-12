const fs = require('fs')
require('dotenv').config();

const path = '../banFile.txt'

// Appends the userID to the ban File
const writeBanFile = (userID) => {
    if(!fs.existsSync(path)){
        console.log("Ban File doesn't exist, creating one")
        fs.writeFileSync(path,"")
    }

    fs.appendFileSync(path, userID + ",")

}

const readBanFile = () => {

    const banFile = fs.readFileSync(path , 'utf-8')
    const bannedUserIDs = banFile.split(",").reduce((a,v) => ({...a,[v] : v}), {})

    return bannedUserIDs
}


module.exports = {writeBanFile, readBanFile}