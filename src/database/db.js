import { MongoClient } from "mongodb";
//import dotenv from "dotenv";
//dotenv.config()

const mongoClient = new MongoClient("mongodb://localhost:27017"); //porta do mongo

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log("err mongoDB", err);
};

const db = mongoClient.db("myWallet");

export const usuarios = db.collection("usuarios");
export const sessoes = db.collection("sessoes");
export const transacoes = db.collection("transicoes");