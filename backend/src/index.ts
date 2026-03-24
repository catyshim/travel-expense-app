import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expensesRouter from "./routes/expenses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/expenses", expensesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
