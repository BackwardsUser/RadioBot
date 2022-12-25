var interaction = require('../../index').interaction
var path = require('path')
var fs = require('fs');
const ytdl = require('ytdl-core');

var isPlaying = false;
var queueDown = false;


/* General */

function downloadFromLink(link, songName, guildID, play, interaction) {
    if (!link) return;
    if (!guildID) return;
    ytdl(link, { filter: 'audioonly'}).pipe(fs.createWriteStream(path.join(__dirname, "..", "..", "queue", guildID, `${songName}.mp3`)))
    if (play) require("./voice").song(interaction, guildID, songName);
}


/* Player related */

function getPrevious() {
}

function getPlaying() {
}

function getNext() {
}


/* Queue Related */

function addToQueue(interaction, songName, songLink) {
    var queueLoc = path.join(__dirname, "..", "..", "queue", interaction.guild.id.toString());
    console.log(`queueLoc: ${queueLoc}`)
    var isQueue = fs.readdirSync(queueLoc).filter(f => f.startsWith("queue"));
    if ( isQueue.length < 1 ) fs.writeFileSync(path.join(queueLoc, "queue.json"), JSON.stringify({}));
    var queue = fs.readFileSync(path.join(queueLoc, "queue.json"))
    var queueOBJ = JSON.parse(queue);
    queueOBJ[songName] = {
        songLink
    }
    fs.writeFileSync(path.join(__dirname, "..", "..", "queue", interaction.guild.id.toString(), "queue.json"), JSON.stringify(queueOBJ), "utf-8");
    interaction.reply(`Successfully added \`${songName}\` to the queue.`)
}

/* element= */
/* type (string-name, number-position) */
/* data (string, number, etc.) */
function removeFromQueue(element) {
}


/* Information related */

function displaySongName() {
}

function getSongInformation(song) {
}


/* Module Exports */

module.exports = {
    isPlaying,
    queueDown,

    getNext,
    getPlaying,
    addToQueue,
    getPrevious,
    removeFromQueue,
    displaySongName,
    downloadFromLink,
    getSongInformation
}