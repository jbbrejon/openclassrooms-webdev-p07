// SCRIPT DESCRIPTION : index of all sequelize models (called from ../app.js)

// Module dependencies
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Create new instance of Sequelize to connect to mysql db
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Specify which model to call
db.users = require('./user')(sequelize, Sequelize);
db.posts = require('./post')(sequelize, Sequelize);
db.comments = require('./comment')(sequelize, Sequelize);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = db;
