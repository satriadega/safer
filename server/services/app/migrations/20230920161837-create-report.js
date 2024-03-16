'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references : {
          model : "Users",
          key : "id"
        },
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      mainImage: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      latitudeDelta: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      longitudeDelta: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};