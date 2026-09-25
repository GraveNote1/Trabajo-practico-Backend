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

const Product = mongoose.model<IProduct>("Product", productSchema)

const connectDb = async (URI: string) => {
    try {
        await mongoose.connect(URI)
        
        } 
    catch (error) {
        console.error("Error al conectar a MongoDB:", error)
        process.exit(1)
    }
}
const isValidId = (id: string) => {
    return mongoose.isValidObjectId(id)
}
const getBooks = async (id?: string) => {
    try {
        if (!id) {
            return await Product.find()
        }
        if (!isValidId(id)) {
            throw new Error("Invalid ID format")
        }
        const foundBook = await Product.findById(id)
        if (!foundBook) {
            throw new Error("Book not found")
        }
        return foundBook
    } catch (error) {
        console.error("Error al obtener libros:", error)
        throw error
    }

}
const createBook = async (bookData: IProduct) => {
    try {
        const newBook = new Product(bookData)
        return await newBook.save()
    } catch (error) {
        console.error("Error al crear libro:", error)
        throw error
    }
}
const updateBook = async (id: string, bookData: Partial<IProduct>) => {
    try {
        if (!isValidId(id)) {
            throw new Error("Invalid ID format")
        }
        const updatedBook = await Product.findByIdAndUpdate(id, bookData, { new: true })
        if (!updatedBook) {
            throw new Error("Book not found")
        }
        return updatedBook
    } catch (error) {
        console.error("Error al actualizar libro:", error)
        throw error
    }
}

