const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT id, name FROM albums WHERE id=$1',
            values: [id],
        };
        const { rows, rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }
        return rows[0];
    }

    async editAlbumById(id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id=$3 RETURNING id',
            values: [name, year, id],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Album gagal diperbarui');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const { rowCount } = await this._pool.query(query);
        if (!rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = AlbumsService;
