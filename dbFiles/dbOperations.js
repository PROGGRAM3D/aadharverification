const config = require("./dbConfig.js");
const sql = require("mssql/msnodesqlv8.js");



const tableName = 'UsersTable';
const script_createTable = `
      CREATE TABLE ${tableName} (
        userId INT IDENTITY(1,1) PRIMARY KEY,
        userName NVARCHAR(255) NOT NULL,
        userPassword NVARCHAR(255) NOT NULL,
        userAadharNo BIGINT CHECK (userAadharNo >= 100000000000 AND userAadharNo <= 999999999999),
        userAccountAddress NVARCHAR(255) NOT NULL
      );
    `;
const createTable = async () => {
    console.log('Creating table....')
    try {
        const pool = await sql.connect(config);
        const tableExistResult = await pool.request()
            .query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'`);

        if (tableExistResult.recordset.length === 0) {

            await pool.request().query(script_createTable);
            console.log(`Table '${tableName}' created successfully.`);
        } else {
            console.log(`Table '${tableName}' already exists.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await sql.close();
    }
}
const isExisting = async (aadhaarNumber) => {
    console.log('Checking if user exists or not...');
    console.log(aadhaarNumber)
    try {
        const pool = await sql.connect(config);
        const existingUser = await pool
            .request()
            .query(`SELECT * FROM UsersTable WHERE userAadharNo = ${aadhaarNumber}`);
        return existingUser.recordset.length > 0;
    } catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await sql.close();
    }
}

const register = async (aadhaarNumber, aadhaarName, password, accountAddress) => {
    console.log('Registering...')
    try {
        const pool = await sql.connect(config);
        await pool
            .request()
            .query(`INSERT INTO UsersTable(userName,userPassword,userAadharNo,userAccountAddress) VALUES('${aadhaarName}','${password}',${aadhaarNumber},'${accountAddress}')`);
        console.log('registered-success');
    } catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await sql.close();
    }
}
const validate = async (aadhaarNumber, password) => {
    console.log('Validating...');
    try {
        const pool = await sql.connect(config);

        const user = await pool
            .request()
            .query(`Select * from UsersTable where userPassword = '${password}' and userAadharNo = ${aadhaarNumber}`);
        if (user.recordset.length > 0) {
            return user.recordset[0].userPassword == password;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sql.close();
    }
}

const getUserInfo = async (aadhaarNumber) => {
    try {
        const pool = await sql.connect(config);
        const user = await pool
            .request()
            .query(`SELECT * FROM UsersTable WHERE userAadharNo = ${aadhaarNumber}`);

        return user.recordset[0];
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    } finally {
        await sql.close();
    }
};
module.exports = { createTable, register, isExisting, validate, getUserInfo }




