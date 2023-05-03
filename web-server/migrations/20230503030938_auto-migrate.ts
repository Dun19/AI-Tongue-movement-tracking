import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user')
  await knex.schema.dropTableIfExists('blog')

  if (!(await knex.schema.hasTable('request_log'))) {
    await knex.schema.createTable('request_log', table => {
      table.increments('id')
      table.text('method').notNullable()
      table.text('url').notNullable()
      table.text('user_agent').nullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('request_log')

  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments('id')
      table.string('username', 32).notNullable()
      table.specificType('password_hash', 'char(60)').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('blog'))) {
    await knex.schema.createTable('blog', table => {
      table.increments('id')
      table.integer('author_id').unsigned().notNullable().references('user.id')
      table.string('title', 50).notNullable()
      table.text('content').notNullable()
      table.timestamps(false, true)
    })
  }
}
