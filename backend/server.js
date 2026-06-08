require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

startServer();
