'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        fullName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        email: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING,
        },
        phoneNumber: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        roleId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'Role',
            key: 'id',
          },
          onUpdate: 'CASCADE', // Các tùy chọn về cập nhật dữ liệu
          onDelete: 'CASCADE', // Các tùy chọn về xóa dữ liệu
        },
        dob: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        avatar: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        // isDelete: {
        //   allowNull: true,
        //   type: Sequelize.BOOLEAN,
        //   defaultValue: false,
        // },
        // codeOTP: {
        //   allowNull: true,
        //   type: Sequelize.STRING,
        // },
        schoolIds: {
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
      },
      await queryInterface.addColumn('Users', 'isDelete', {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      await queryInterface.addColumn('Users', 'codeOTP', {
        allowNull: true,
        type: Sequelize.STRING,
      }),
    );
    // Movie.belongsToMany(Actor, { through: ActorMovies });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
