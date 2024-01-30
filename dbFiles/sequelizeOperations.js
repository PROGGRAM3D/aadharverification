const { sequelize, DataTypes } = require('./sequelizeConfig');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAadharNo: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      min: 100000000000,
      max: 999999999999,
    },
  },
  userAccountAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
const createTable = async () => {
    console.log('Checking if table exists...');
    try {
      // Check if the table exists
      const tableExists = await User.sync({ force: false });
      if (!tableExists) {
        // Create the table only if it doesn't exist
        await User.sync({ force: true });
        console.log(`Table 'Users' created successfully.`);
      } else {
        console.log('Table already exists.');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const isExisting = async (aadhaarNumber) => {
  console.log('Checking if user exists or not...');
  try {
    const existingUser = await User.findOne({
      where: { userAadharNo: aadhaarNumber },
    });
    return existingUser !== null;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const register = async (aadhaarNumber, aadhaarName, password, accountAddress) => {
  console.log('Registering...');
  try {
    await User.create({
      userName: aadhaarName,
      userPassword: password,
      userAadharNo: aadhaarNumber,
      userAccountAddress: accountAddress,
    });
    console.log('Registered successfully.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const validatePassword = async (aadhaarNumber, password) => {
  console.log('Validating password...');
  try {
    const user = await User.findOne({
      where: { userAadharNo: aadhaarNumber },
    });

    if (user) {
      return user.userPassword === password;
    }

    return false;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

module.exports = { authenticate, createTable, register, isExisting, validatePassword };
