const express = require("express");
const pool = require("./config/database");

const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error de conexión" });
  }
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en puerto 3000");
});

pool.connect()
  .then(() => {
    console.log("✅ Conexión exitosa");
  })
  .catch(err => {
    console.error("❌ Error completo:");
    console.error(err);
  });