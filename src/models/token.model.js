'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Token.init({
        userId: DataTypes.INTEGER,
        refreshToken: DataTypes.STRING,
        accessToken: DataTypes.STRING,
        deviceToken: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens',
        timestamps: true,
    })
    return Token
}
