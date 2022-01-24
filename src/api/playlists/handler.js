class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postSongPlaylist = this.postSongPlaylist.bind(this);
        this.getSongsPlaylist = this.getSongsPlaylist.bind(this);
        this.deleteSongPlaylist = this.deleteSongPlaylist.bind(this);
    }

    async postPlaylistHandler({ payload }, h) {
        try {
            this._validator.validatePlaylistPayload(payload);

            const playlistId = await this._service.addPlaylist(payload);
            const response = h.response({

            });
        } catch (error) {

        }
    }

    async getPlaylistsHandler() {

    }

    async deletePlaylistHandler({ params }, h) {

    }

    async postSongPlaylist({ payload }, h) {

    }

    async getSongsPlaylist({ params }, h) {

    }

    async deleteSongPlaylist({ params }, h) {

    }
}