const mongoose = require("mongoose");
const DB = process.env.DB_URL;

exports.databaseConnect = () => {
  mongoose.connect(DB, () => {
    console.log(`DB CONNECT SUCCESSFULLY`);
  });
};
