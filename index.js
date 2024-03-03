import express, { json } from "express";
const app = express();
import colors from "colors";
import { config } from "dotenv";
import morgan from "morgan";
import { default as connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"
import cors from "cors"

//MiddleWares


app.use(json());
app.use(morgan('dev'));
app.use(cors());









//config ENV
config();


//Database Config
connectDB()



//Routes

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/product",productRoute)








const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`.bgCyan.white);
});
