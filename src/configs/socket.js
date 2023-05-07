const { Server } = require("socket.io");
const appConfig = require("./app");

const getRoomId = (shopId, orderId) => {
  return `order-${shopId}-${orderId}`;
};

const socket = (httpServer, app) => {
  const allowedOrigins = appConfig.origin.toString().split(",");
  const io = new Server(httpServer, {
    // transports: ['websocket', 'polling'],
    // cors: {
    //   origin: allowedOrigins,
    // },
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST'],
    },
  });
  io.on("connection", (socket) => {
    socket.on("join-order", ({ shopId, orderId }) => {
      const roomId = getRoomId(shopId, orderId);
      socket.join(roomId);
      socket.data.roomId = roomId;
    });

    socket.on("disconnect", () => {
      const roomId = socket.data?.roomId;
      if (roomId) {
        socket.leave(roomId);
      }
    });
  });
  app.use((req, res, next) => {
    req.io = {
      commitOrderUpdated: ({ shopId, orderId, payload }) => {
        const roomId = getRoomId(shopId, orderId);
        io.to(roomId).emit("order-updated", payload);
      },
    };
    next();
  });
};
module.exports = socket;
