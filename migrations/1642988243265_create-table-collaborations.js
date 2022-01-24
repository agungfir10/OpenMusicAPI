/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)'
        },
        user_id: {
            type: 'VARCHAR(50)'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('collaborations');
};
