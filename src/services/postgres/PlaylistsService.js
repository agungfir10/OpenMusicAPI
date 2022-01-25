/* eslint-disable quotes */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: 'SELECT id, name, owner AS username FROM playlists WHERE owner = $1 ',
            values: [owner]
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async getPlaylistById(id) {
        const query = {
            text: 'SELECT * FROM playlists id=$1',
            values: [id],
        };
        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return rows[0];
    }

    async editSongById(id, { title, year, performer, genre, duration }) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at=Now() WHERE id=$6 RETURNING id',
            values: [title, year, performer, genre, duration, id],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Lagu gagal diperbarui');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const { rowCount } = await this._pool.query(query);
        if (!rowCount) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists id = $1',
            values: [id]
        };
        const { rows } = await this._pool.query(query);

        if (!rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistsService;
