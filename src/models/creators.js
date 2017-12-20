export const createUser = (user = {}) => {
    return {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    }
}

export const createSong = (song = {}) => {
    return {
        id: song._id || song.id,
        title: song.title || "",
        artist: createArtist(song.artist),
        youtubeId: song.youtubeId || "",
        duration: song.metadata && song.metadata.duration
    }
}

export const createPlaylist = (playlist = {}) => {
    return {
        id: playlist._id || playlist.id,
        name: playlist.name,
        owner: playlist.owner,
        songs: (playlist.songs || []).map(song => (song._id || song.id)),
        type: playlist.type
    }
}

export const createArtist = (artist = {}) => {
    return {
        id: artist._id || artist.id,
        name: artist.name,
        type: artist.type
    }
}