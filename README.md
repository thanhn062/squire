
# Squire

This is a Discord bot designed for communities that want to help pair students up with volunteer mentors ("Guardians") through a ticket based system, all encapsulated within the Discord app. It was built entirely using the Discord.js library.

To run:

    1. Register the bot with discord, create the necessary Discord channels (look in the environment variables section), and set the environment variables
    2. Edit `commands-form/help.js` to set required inputs when a user tries to submit a help ticket
    3. Create forum tags in your forum according to the inputs you set in `commands-form/help.js`
    3. Edit `forum_tag_ids.js` with the ID's of the forum tags, the key should be the name of the tag, with the value being the tag's ID
    2. Run `node deploy-commands.js` to register the slash commands with discord
    3. Run `node app.js` to start the bot

Help tickets can be submitted with `/help` in Discord, they are sent to the "help board" channel you created in step 1.

The bot can be run with as-is to see how student input works and how it corresponds to forum tags.







## Problem Statement


- Requesting help from volunteers in a Discord community is inefficient
    - Students are expected to post in busy chat channels where their problem may or may not be discovered by a guardian. If a student is new to programming, they may not have the skills yet to research solutions and rely on these guardians to help. To find these students, guardians must regularly scan a number of channels, creating uneccesary work for these volunteers. Some guardians may want to help, but necessarily not have the time to scan these channels.

- Chat channels as archives for previously asked questions is inefficient
    - To find previously answered questions, students need to search through the channel with non-standardized keywords to find where their question was answered. If they manage to find a thread where their question was answered, they need to sift through the dialogue contained in the thread to find relevant information. Chat channels acting as archives to previously asked questions implies a lot of uneccesary clutter to deal with. If the discussion around the problem happened in a DM or call, there is no way of referencing it in the future

- Asking for help is daunting
    - A student may be embarrassed to ask for help within a public channel. They may only be comfortable talking in a private call or DM. 

    

## Solution

- Squire sends help requests directly to guardians
    - When a student requests help, a ticket is created with details of the encountered problem and is posted to a dedicated, read-only help board where guardians can claim the ticket. Once a ticket is claimed, both parties are sent a DM by Squire with the relevant ticket, the guardian's name,  and a message requesting them to reach out to each other. Job posts in the help board are easy to read, and their status (claimable or in-progress) is reflected in the ticket.

- Squire automatically archives resolved tickets
    - When a ticket is resolved, the guardian must enter details regarding the resolved problem, as well as the solution they came up with. Then, Squire creates a post in a dedicated resolved tickets forum with the ticket, problem, and solution available to read. Posts are tagged using details from the ticket. Guardians can then filter forum posts by available tags to find past resolved tickets relevant to them. This forum can optionally be able to be read by students.

- Squire makes asking for help more private
    - Submitting a help request is not visible to other users. Tickets are only viewable by guardians, and further discussion can occur in a private DM or call. 
## Features

- Create help tickets with `/help`, with customizable inputs
- Guardians can respond to and claim tickets in a private help board
- Once a ticket is resolved, an archive post is created with the details surrounding the encountered problem and solution


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLIENT_TOKEN` -> The discord bot's CLIENT_TOKEN used to login

`clientId` -> The client_id of the registered bot

`helpBoardChannelId` -> the channel ID where you want the help requests to go 

`resolvedTicketsChannelId` -> the ID of the forum where you want the resolved tickets to go. Must be a discord Forum channel.




## Authors

- [@ThanhNgo](https://www.github.com/thanhn062)
- [@ConnorCable](https://www.github.com/ConnorCable)


## Lessons Learned

*Connor*:    
    `Discord.js is a powerful library that was intuitive to use. The main challenge in this project was working around the requirements set by the Discord API. Every interaction in the discord app needs a corresponding reply, and there was a roadblock surrounding replying to interactions that have already been replied to. We had a lot of discussion about how we could address real problems that students face, and I think we created something useful as we tried to empathize with these students. If I were to do this again, I would do it in Java to get more practice with the language and OOP. Overall I had a lot of fun building and collaborating with Thanh and I hope someone gets some use from Squire.`

