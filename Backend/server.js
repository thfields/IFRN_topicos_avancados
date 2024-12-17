import app from "./src/app.js";
import dbConnect from './src/config/db.js';

const PORT = process.env.PORT || 3000;

dbConnect()
    .then(() => console.log("Conectado ao MongoDB!"))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Servidor online em ${PORT}`);
});