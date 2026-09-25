import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


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

const booksSchema = new mongoose.Schema<IProduct>({
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
        console.error("Invalid ID:", error.message)
    }
}

const Book = mongoose.model<IProduct>("Book", booksSchema) 

const connectDb = async (URI: string) => {
    try {
        await mongoose.connect(URI)
        
        } 
    catch (error) {
        console.error("Error while trying to connect to MongoDB:", error)
        process.exit(1)
    }
}
const isValidId = (id: string) => {
    return mongoose.isValidObjectId(id)
}
const getBooks = async (id?: string) => {
    try {
        if (!id) {
            return await Book.find()
        }
        if (!isValidId(id)) {
            throw new Error("Invalid ID format")
        }
        const foundBook = await Book    .findById(id)
        if (!foundBook) {
            throw new Error("Book not found")
        }
        return foundBook
    } catch (error) {
        console.error("Error al obtener libros:", error)
        throw error
    }

}
const createBook = async (bookData: string[]) => {
    try {
        const newBook: IProduct = {
            title: "Book Title",
            author: "Unknown author",
            price: 0,
            stock: 0
        }

        for (const data of bookData) {
            const [key, value] = data.split("=")

            if (!value) {
                continue
            }

            switch (key) {
                case "title":
                    newBook.title = value
                    break

                case "author":
                    newBook.author = value
                    break

                case "price":
                    newBook.price = Number(value)
                    break

                case "stock":
                    newBook.stock = Number(value)
                    break
            }
        }

        if (newBook.title === "Book Title") {
            console.error("El campo 'title' es obligatorio")
            return
        }

        if (Number.isNaN(newBook.price)) {
            console.error("El campo 'price' debe ser un número")
            return
        }

        if (Number.isNaN(newBook.stock)) {
            console.error("El campo 'stock' debe ser un número")
            return
        }

        const createdBook = await Book.create(newBook)

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
        const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true })
        if (!updatedBook) {
            throw new Error("Book not found")
        }
        return updatedBook
    } catch (error) {
        console.error("Error al actualizar libro:", error)
        throw error
    }
}
const parseBookData = (bookData: string[]): Partial<IProduct> => {
    const updates: Partial<IProduct> = {}

    for (const data of bookData) {
        const [key, value] = data.split("=")

        if (!value) {
            continue
        }

        switch (key) {
            case "title":
                updates.title = value
                break

            case "author":
                updates.author = value
                break

            case "price":
                updates.price = Number(value)
                break

            case "stock":
                updates.stock = Number(value)
                break
        }
    }

    return updates
}

const deleteBook = async (id: string ) => {
    try {
        if (!isValidId(id)) {
            throw new Error("Invalid ID format")
        }
        const deletedBook = await Book.findByIdAndDelete(id)
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
                const bookData = args.slice(1)
                const createdBook = await createBook(bookData)
                console.log(createdBook)
                break
            case "update": {
    const idToUpdate = args[1]

    if (!idToUpdate) {
        console.error("Tenés que proporcionar un ID")
        break
    }

            const updateData = parseBookData(args.slice(2))

            const updatedBook = await updateBook(
                idToUpdate,
                updateData
            )

            console.log(updatedBook)

            break
}
            case "delete": {
                const idToDelete = args[1]

                    if (!idToDelete) {
                        console.error("Tenés que proporcionar un ID")
                        break
                    }

                const deletedBook = await deleteBook(idToDelete)
                console.log(deletedBook)

            break
}

            
        }
        await mongoose.disconnect()
            process.exit(0)

            
}
    
main()