import mongoose from "mongoose"

process.loadEnvFile()

const URI_DB = process.env.URI_DB

if (!URI_DB) {
    console.error("Falta la variable de entorno URI_DB")
    process.exit(1)
}
interface IProduct {
    titulo: string,
    autor: string,
    precio: number,
    stock: number,
}

const productSchema = new mongoose.Schema<IProduct>({
    titulo: {
        type: String,},
    autor: {
        type: String,},
    precio: {
        type: Number,},
    stock: {
        type: Number,}
})