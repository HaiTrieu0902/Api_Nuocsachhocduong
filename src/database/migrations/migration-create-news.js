'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'News',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        type: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        thumbnail: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        content: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        accountId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE', // Các tùy chọn về cập nhật dữ liệu
          onDelete: 'CASCADE', // Các tùy chọn về xóa dữ liệu
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      // await queryInterface.addColumn('Users', 'isDelete', {
      //   allowNull: true,
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false,
      // }),
      // await queryInterface.addColumn('Users', 'codeOTP', {
      //   allowNull: true,
      //   type: Sequelize.STRING,
      // }),
    );
    // Movie.belongsToMany(Actor, { through: ActorMovies });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('News');
  },
};
