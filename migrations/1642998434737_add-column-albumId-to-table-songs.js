/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumn('songs', {
        albumId: {
            type: 'VARCHAR(50)',
        },
    });

    pgm.addConstraint('songs', 'FK_SongAlbum', {
        foreignKeys: {
            columns: ['albumId'],
            references: 'albums(id)',
            onDelete: 'cascade'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('songs');

    pgm.dropConstraint('songs', 'FK_SongAlbum');
};