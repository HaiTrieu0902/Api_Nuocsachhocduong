'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('maintenance', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      categoryMaintenanceId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'category_maintenance',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      accountId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      staffId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      installRecordId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'installRecords',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      schoolId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'schools',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      statusId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'status',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      reasonRepair: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      solution: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      repairFees: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      timeMaintenance: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      images_request: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      images_response: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      isDelete: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    // Movie.belongsToMany(Actor, { through: ActorMovies });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('maintenance');
  },
};
