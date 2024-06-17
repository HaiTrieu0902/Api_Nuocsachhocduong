'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      code: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      discount: {
        allowNull: true,
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      content: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      categoryProductId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'category_product',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      images: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addColumn('Products', 'isDelete', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
    await queryInterface.removeColumn('Products', 'isDelete');
  },
};
