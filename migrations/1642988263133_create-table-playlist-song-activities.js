/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)'
        },
        song_id: {
            type: 'VARCHAR(50)',
        },
        user_id: {
            type: 'VARCHAR(50)',
        },
        action: {
            type: 'VARCHAR(50)',
        },
        time: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities');
};