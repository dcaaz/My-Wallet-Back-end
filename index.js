import express, { json } from "express";
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import joi from "joi";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //receber req do cliente no formato json

const mongoClient = new MongoClient(process.env.MONGO_URI); //porta do mongo

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log("err mongoDB", err);
}

const db = mongoClient.db("myWallet");


app.listen(5000, () => {
    console.log("Serving running in port: 5000");
}); //verifica/"escuta" se tem alguma solicitação para acessar a porta