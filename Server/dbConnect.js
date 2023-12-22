const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://aman5281:atfcCs8i9O70DNdZ@cluster0.nm2isyy.mongodb.net/?retryWrites=true&w=majority";

  try {
    mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDb is connected"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
