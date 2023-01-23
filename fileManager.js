const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
    }
    agregarProducto = async (title, description, price, thumbnail, code, stock) => {
        const producto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if (title && description && price && thumbnail && code, stock) {

            if (!fs.existsSync(this.path)) {
                try {
                    producto.id = 1
                    const newData = JSON.stringify([producto])
                    await fs.promises.writeFile(this.path, newData, 'utf-8')
                }
                catch (err) {
                    console.log("Error al grabar primer producto", err)
                }
            }

            else {
                try {
                    const data = JSON.parse(await fs.promises.readFile(this.path))
                    if (data.some((prod => prod.code === code))) console.log("Duplicated product")
                    else {
                        producto.id = data[data.length - 1].id + 1
                        const newData = JSON.stringify([...data, producto])
                        await fs.promises.writeFile(this.path, newData, 'utf-8')
                    }
                }
                catch (err) {
                    console.log("Error al grabar el producto", err)
                }
            }
        }
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            try {
                const data = await fs.promises.readFile(this.path)
                const dataParsed = JSON.parse(data)
                return dataParsed
            }
            catch (err) {
                console.log("Error al leer productos", err)
            }
        }
        else {
            console.log("Aún no hay productos agregados")
            return []
        }
    }

    getProductById = async (id) => {
        const data = await this.getProducts()
        const find = data.find(prod => prod.id === id)
        return find ? find : "Not Found"
    }

    updateProduct = async(id, field, value)=>{
        try{
            const products = await this.getProducts()
            const item = products.find(prod => prod.id === id)
            if(item){
                item[field] = value
                await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
            } 
            else{
                console.log("Id inexistente");
            }
        }
        catch(err){
            console.log("Error al actualizar producto")
        }
    }

    deleteProduct = async ()=>{
        if(fs.existsSync){
            try{
                await fs.promises.unlink(this.path)
                console.log("Catalogo eliminado")
            }
            catch(err){
                console.log("Error al eliminar")
            }
        }
        else{
            console.log("No hay catalogo por eliminar");
        }

    }
}

const script = async () => {
    //create an instance
    const manager = new ProductManager("./productos")

    //calling getProducts method
    console.log("Empty collection", await manager.getProducts())

    //adding products
    await manager.agregarProducto("producto prueba", "Este es un producto prueba", 200, "Sin Imagen", "abc123", 25)
    console.log("Productos: ", await manager.getProducts())

    //rejecting duplicated product
    await manager.agregarProducto("producto prueba", "Este es un producto prueba", 200, "Sin Imagen", "abc123", 25)
    console.log("Productos: ", await manager.getProducts())
    
    //finding product success case
    console.log("Success case: ", await manager.getProductById(1))

    //finding product error case
    console.log("Error case: ", await manager.getProductById(2))

    //updating product
    await manager.updateProduct(1, "title", "nuevoNombre")
    console.log("Producto actualizado: ", await manager.getProducts())

    //deleting products
    await manager.deleteProduct("./productos")
}

script()

