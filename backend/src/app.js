import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import AuthRoutes from "./routes/auth.route.js";
import InstitutionRoutes from './routes/institution.route.js'
import InstitutionParameterRoutes from './routes/institution_parameter.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","UPDATE","DELETE"],
    credentials: true,
}))

// server static files from public directory
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", AuthRoutes);
app.use("/api/institution",InstitutionRoutes);
app.use("/api/institutionparameter",InstitutionParameterRoutes);

app.get("/",(req,res)=>{
    res.send("Server is running");
})

export default app;