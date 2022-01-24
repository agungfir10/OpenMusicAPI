const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../utils/ServerError');

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler({ payload }, h) {
        try {
            this._validator.validateAlbumPayload(payload);

            const albumId = await this._service.addAlbum(payload);

            const response = h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    albumId,
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

    async getAlbumByIdHandler({ params }, h) {
        try {
            const { id } = params;
            const album = await this._service.getAlbumById(id);

            const response = h.response({
                status: 'success',
                data: {
                    album,
                },
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(404);
                return response;
            }

            const response = h.response(ServerError);
            response.code(500);
            return response;
        }
    }

    async putAlbumByIdHandler({ payload, params }, h) {
        try {
            this._validator.validateAlbumPayload(payload);

            const { name, year } = payload;
            const { id } = params;

            await this._service.editAlbumById(id, {
                name,
                year,
            });

            return {
                status: 'success',
                message: 'Album berhasil diperbarui',
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

    async deleteAlbumByIdHandler({ params }, h) {
        try {
            const { id } = params;
            await this._service.deleteAlbumById(id);

            return {
                status: 'success',
                message: 'Album berhasil dihapus',
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

module.exports = AlbumsHandler;
