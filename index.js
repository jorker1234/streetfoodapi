const app = require("express")();
//const { createServer } = require("http");
const appConfig = require("./src/configs/app");
const expressConfig = require("./src/configs/express");
const middleware = require("./src/configs/middleware");
const routes = require("./src/routes");
//const socket = require("./src/configs/socket");

expressConfig(app);

app.use(middleware);

//const httpServer = createServer(app);
//socket(httpServer, app);

app.use(routes);

const server = app.listen(appConfig.port, () => {
  const { host, port } = server.address();
  console.log(`Server is running at http://${host || "localhost"}:${port}`);
});
