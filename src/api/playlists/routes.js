const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongPlaylist,
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongsPlaylist,
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongPlaylist,
    },
];

module.exports = routes;
