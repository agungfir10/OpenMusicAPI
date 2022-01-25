const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../utils/ServerError');

class CollaborationsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    }

    async postCollaborationHandler({ payload, auth }, h) {
        try {
            this._validator.validateCollaborationsPayload(payload);
            const { id: credentialId } = auth.credentials;
            const { playlistId, userId } = payload;

            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.checkUserCollaborationExist(userId);
            const collaborationId = await this._service.addCollaborations(payload);

            const response = h.response({
                status: 'success',
                message: 'Playlists berhasil ditambahkan',
                data: {
                    collaborationId,
                },
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
}

module.exports = CollaborationsHandler;
