function _isInVC(interaction) {
    if (!interaction.member.voice.channelId) return false;
    else return true;
}

module.exports = {
    isInVC: _isInVC
}