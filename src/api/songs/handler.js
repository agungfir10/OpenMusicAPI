const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../utils/ServerError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);

      const songId = await this._service.addSong(payload);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
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

  async getSongsHandler({ query }) {
    const songs = await this._service.getSongs(query);
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler({ params }, h) {
    try {
      const { id } = params;
      const song = await this._service.getSongById(id);

      const response = h.response({
        status: 'success',
        data: {
          song,
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

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const { title, year, performer, genre, duration } = request.payload;
      const { id } = request.params;

      await this._service.editSongById(id, {
        title,
        year,
        performer,
        genre,
        duration,
      });

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
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

  async deleteSongByIdHandler(request, h) {
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

module.exports = SongsHandler;
