exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid()); // Gera o UUID automaticamente
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.integer('balance_cents').notNullable().defaultTo(0); // Saldo inicial zerado
        table.timestamps(true, true); // Cria created_at e updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};