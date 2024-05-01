// socket.js
const corsOptions = require('./config/corsOptions'); // Importa tu configuración CORS

let io = null;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer, {
      cors: corsOptions, // Usa tus opciones CORS importadas
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};
