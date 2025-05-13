const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let players = [];
let roomNumber = 1;
let MAX_LIMIT = 2;
let curentPlayerLength = 0;

io.on("connection", (socket) => {
  let room_id = "room-" + roomNumber;
  if (curentPlayerLength <= MAX_LIMIT) {
    console.log("Player added to queue");
    if (curentPlayerLength == 0) {
      socket.emit("symbol", "O");
    } else {
      socket.emit("symbol", "X");
    }
    socket.join(room_id);
    curentPlayerLength++;
    if (curentPlayerLength == MAX_LIMIT) {
      console.log("game stated for ", room_id);
      io.to(room_id).emit("player-matched");
      roomNumber++;
      curentPlayerLength = 0;
    }
  } else {
  }
  console.log("connected", socket.id);

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

app.get("/", (req, red) => {
  res.json({
    status: "working...",
  });
});

httpServer.listen(4000, () => {
  console.log("PORT : 4000");
});
