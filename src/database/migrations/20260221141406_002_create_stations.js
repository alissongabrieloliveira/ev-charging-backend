exports.up = function (knex) {
    return knex.schema.createTable('stations', table => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('identifier').notNullable().unique(); // Ex: Número de série da base
        table.enu('status', ['available', 'charging', 'offline', 'maintenance']).notNullable().defaultTo('available');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('stations');
};