module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "ocSqlP7groupomni4",
    DB: "oc_groupomania",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};