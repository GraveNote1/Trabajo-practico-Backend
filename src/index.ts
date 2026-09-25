import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

process.loadEnvFile()

const URI_DB = process.env.URI_DB

if (!URI_DB) {
    console.error("Falta la variable de entorno URI_DB")
    process.exit(1)
}
interface IProduct {
    title: string,
    author: string,
    price: number,
    stock: number,
}

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,},
    author: {
        type: String,},
    price: {
        type: Number,},
    stock: {
        type: Number,}
})

const handleError = (error: Error) => {
    if (error.name === "CastError") {
        console.error("ID inválido:", error.message)
    }
}

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
const createBook = async (
    bookData: Partial<IProduct> = {}
) => {
    try {
        const newBook: IProduct = {
            title: bookData.title ?? "Book title",
            author: bookData.author ?? "Unknown author",
            price: bookData.price ?? 0,
            stock: bookData.stock ?? 0
        }

        const createdBook = await Product.create(newBook)

        return createdBook

    } catch (error) {
        const e = error as Error
        return handleError(e)
    }
}
    const updateBook = async (id: string, bookData: Partial<IProduct> | undefined) => {
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

const deleteBook = async (id: string ) => {
    try {
        if (!isValidId(id)) {
            throw new Error("Invalid ID format")
        }
        const deletedBook = await Product.findByIdAndDelete(id)
        if (!deletedBook) {
            throw new Error("Book not found")
        }
        return deletedBook
    } catch (error) {
        console.error("Error al eliminar libro:", error)
        throw error
    }
}

const main = async () => {
    const args = process.argv.slice(2)
    const action = args[0]

    await connectDb(URI_DB)

    switch (action) {
            case "info":
                console.log("Comandos disponibles: readAll, readOne <id>, create, update <id> {}, delete <id>")
                break
            case "readAll":
                const allBooks = await getBooks()
                console.log(allBooks)
                break
            case "readOne":
                const idToRead = args[1]
                const book = await getBooks(idToRead)
                console.log(book)
                break
            case "create":

            
        }
        await mongoose.disconnect()
            process.exit(0)

            
}
    
main()