const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../utils/ServerError');

class PlaylistSongActivitiesHandler {
    constructor(service) {
        this._service = service;

        this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
    }

    async getPlaylistSongActivitiesHandler({ params, auth }, h) {
        try {
            const { id } = params;
            const { id: credentialId } = auth.credentials;

            await this._service.verifyPlaylistSongActivities(id, credentialId);
            const playlistSongActivities = await this._service.getPlaylistSongActivities(id);

            return {
                status: 'success',
                data: {
                    playlistId: id,
                    activities: playlistSongActivities
                },
            };
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

module.exports = PlaylistSongActivitiesHandler;
