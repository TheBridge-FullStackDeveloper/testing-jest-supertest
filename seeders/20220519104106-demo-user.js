'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert ( 'Users', [
      {
      name: 'John',
      email: 'example@example.com',
      password:'123456',
      role:'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Jane',
      email: 'jane@example.com',
      password:'123456',
      role:'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mike',
      email: 'mike@elfary.com',
      password:'123456',
      role:'cryptoBro',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
