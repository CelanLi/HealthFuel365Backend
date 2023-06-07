import app from "./app";

// const https = require("https");
// const fs = require("fs");
// const options = {
//   key: fs.readFileSync(
//     "C:/Users/Harry/Desktop/HealthFuel365_backend/server.key"
//   ),
//   cert: fs.readFileSync(
//     "C:/Users/Harry/Desktop/HealthFuel365_backend/server.crt"
//   ),
// };

// const server = https.createServer(options, app);
const server = app.listen(app.get("port"), () => {
  // eslint-disable-next-line no-console
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  // eslint-disable-next-line no-console
  console.log("  Press CTRL-C to stop\n");
});

export default server;
