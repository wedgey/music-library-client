import { SongStatus } from "../utils/enums";

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
        artist: song.artist.map(artist => createArtist(artist)),
        artistNames: song.artist.map(artist => artist.name).join(', '),
        youtubeId: song.youtubeId || "",
        duration: song.metadata && song.metadata.duration,
        status: song.status || SongStatus.pending,
        metaData: song.metadata && {
            channelTitle: song.metadata.channelTitle,
            channelId: song.metadata.channelId,
            youtubeTitle: song.metadata.title
        }
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

export const createChannel = (channel = {}) => {
    return {
        id: channel._id || channel.id,
        owner: channel.owner,
        youtubeId: channel.youtubeId,
        title: channel.title,
        description: channel.description,
        customUrl: channel.customUrl        
    }
}