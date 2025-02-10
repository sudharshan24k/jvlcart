const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const app = require('./app'); // Import the app file


dotenv.config({ path: "config/config.env" });

connectDatabase();

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
