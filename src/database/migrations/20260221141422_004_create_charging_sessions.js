exports.up = function (knex) {
    return knex.schema.createTable('charging_sessions', table => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('station_id').references('id').inTable('stations').onDelete('CASCADE');
        table.enu('status', ['started', 'completed', 'failed']).notNullable().defaultTo('started');
        table.integer('cost_cents').notNullable().defaultTo(0);
        table.integer('energy_consumed_wh').notNullable().defaultTo(0);
        table.timestamp('started_at').defaultTo(knex.fn.now());
        table.timestamp('ended_at'); // Fica nulo até a recarga terminar
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('charging_sessions');
};