exports.up = function (knex) {
    return knex.schema.createTable('transactions', table => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE'); // Se o usuário for deletado, apaga as transações
        table.integer('amount_cents').notNullable();
        table.enu('payment_method', ['pix', 'credit_card']).notNullable();
        table.enu('status', ['pending', 'paid', 'failed']).notNullable().defaultTo('pending');
        table.string('gateway_reference_id').unique(); // ID retornado pelo AbacatePay
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('transactions');
};