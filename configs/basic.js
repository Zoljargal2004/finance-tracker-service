const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

function startApp() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  return app;
}

module.exports = {
  startApp
};
