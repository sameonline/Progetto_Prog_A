import express from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_req, res) => {
  res.send("prima prova di progetto12"); });

app.listen(PORT, () => {
  console.log(`Server attivo, porta:  ${PORT}`); });
