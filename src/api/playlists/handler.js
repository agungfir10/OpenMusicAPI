const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../utils/ServerError');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler({ payload, auth }, h) {
        try {
            this._validator.validatePlaylistPayload(payload);
            const { id: credentialId } = auth.credentials;
            const { name } = payload;

            const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

            const response = h.response({
                status: 'success',
                message: 'Playlists berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(400);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async getPlaylistsHandler({ auth }, h) {
        try {
            const { id: owner } = auth.credentials;
            const playlists = await this._service.getPlaylists(owner);
            return {
                status: 'success',
                data: { playlists },
            };
        } catch (error) {
            if (error) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(400);

                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSongById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            if (error) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                if (error instanceof NotFoundError) {
                    response.code(404);
                } else {
                    response.code(400);
                }
                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }
}

module.exports = PlaylistsHandler;
