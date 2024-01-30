const { Sequelize, DataTypes } = require('sequelize');
const Connection = require('mssql/msnodesqlv8.js');


const sequelize = new Sequelize({
  dialect: 'mssql',
  dialectModule: Connection,
  server: "DESKTOP-T2QA7PE\\MSSQLSERVER01",
  database: "userDB",
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    enableArithAbort: true,
    encrypt: false,
  },
  port: 1433,
});

module.exports = { sequelize, DataTypes };