  // server.js
  require("dotenv").config();
  const express = require("express");
  const app = express();
  const corsOptions = require("./config/corsOptions"); // Asegúrate de que esta ruta sea correcta
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const path = require("path");
  const http = require("http");
  const socketManager = require('./socket');
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use("/", express.static(path.join(__dirname, "public")));

  // Create HTTP server and Socket.IO server
  const server = http.createServer(app);
  // Initialize Socket.IO
  const io = socketManager.init(server);


// Routes
app.use("/auth", require("./Routes/authRoutes"));
app.use("/usuarios", require("./Routes/usersRoutes"));
app.use("/categorias", require("./Routes/categoriaRoutes"));
app.use("/servicios", require("./Routes/servicioRoutes"));
app.use("/roles", require("./Routes/rolesRoutes"));
app.use("/send-reset-password-email", require("./Routes/emailRoutes"));
app.use("/change-password", require("./Routes/usersRoutes"));
app.use("/solicitudes", require("./Routes/solicitudRoutes"));
app.use("/citas", require("./Routes/citaRoutes"));
// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Socket Server successfully connected');
  socket.on('disconnect', () => {
    console.log('Socket Server disconnected');
  });
});

  // Default route for undefined paths
  app.all("*", (req, res) => {
    res.status(404).send("404 Not Found"); // Simplified 404 response
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`El puerto ${PORT} está en uso, intenta cerrar el proceso o usa un puerto diferente.`);
    } else {
      throw e;
    }
  });

