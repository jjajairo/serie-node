const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();

//indicar que utilizará a função json do bodyParser para que ele entende quando enviar uma requisição para a api com informações em json
app.use(bodyParser.json());

//para conseguir decodificar os parametros passados via url
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/index")(app);

app.get("/", function (req, res) {
  res.send("Hello world.");
});

//rodar em server local na porta selecionada
app.listen(port, () => {
  console.clear();
  console.log(`🚀Running at http://localhost:${port}`);
});
