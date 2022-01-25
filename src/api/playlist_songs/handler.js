const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../utils/ServerError');

class PlaylistSongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
        this.getSongsPlaylistHandler = this.getSongsPlaylistHandler.bind(this);
        this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistSongsHandler({ payload, params, auth }, h) {
        try {
            this._validator.validatePlaylistSongsPayload(payload);
            const { id: credentialId } = auth.credentials;
            const { id: playlistId } = params;
            const { songId } = payload;

            await this._service.checkSongExist(songId);
            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.checkSongAndPlaylistExist(playlistId, songId);
            const songIdPlaylist = await this._service.addPlaylistSongs(playlistId, songId);

            const response = h.response({
                status: 'success',
                message: 'Playlist songs berhasil ditambahkan',
                data: {
                    songId: songIdPlaylist
                }
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async getSongsPlaylistHandler({ params, auth }, h) {
        try {
            const { id: playlistId } = params;
            const { id: credentialId } = auth.credentials;

            const playlist = await this._service.verifyPlaylistOwner(playlistId, credentialId);
            const songs = await this._service.getSongsPlaylist(playlistId);
            playlist.songs = songs;
            const response = h.response({
                status: 'success',
                message: 'Playlist songs berhasil ditambahkan',
                data: {
                    playlist
                }
            });

            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async deleteSongFromPlaylistByIdHandler({ payload, params, auth }, h) {
        try {
            this._validator.validatePlaylistSongsPayload(payload);
            const { id: playlistId } = params;
            const { id: credentialId } = auth.credentials;
            const { songId } = payload;

            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deleteSongFromPlaylistById(playlistId, songId);

            const response = h.response({
                status: 'success',
                message: 'Lagu dihapus dari playlist'
            });

            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async deletePlaylistByIdHandler({ params, auth }, h) {
        try {
            const { id: credenttialId } = auth.credentials;
            const { id: playlistId } = params;

            await this._service.verifyPlaylistOwner(playlistId, credenttialId);
            await this._service.deletePlaylistById(playlistId);
            await this._service.deletePlaylistSongsByPlaylistId(playlistId);

            const response = h.response({
                status: 'success',
                message: 'Playlist dihapus'
            });

            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }
}

module.exports = PlaylistSongsHandler;
