import productsModel from "../models/productsModel.js";

export class ProductDBManager {

    async addProduct(newProduct){
        try {
            const {title, description, code, price, status, stock, category} = newProduct;
            if (title && description && code && price && status && stock && category){
                this.validateTypeof(title, description, code, price, status, stock, category);
                const product = await productsModel.findOne({ code: code })
                const prodAdded = product ? ('Code already exist') : await productsModel.create(newProduct)
                return { prodAdded }
            } else {
                throw new Error("Missing fields");
            }
        }catch(error){
            return error;
        }
    }

    async getProducts(){
        try{
            const products = await productsModel.find();
            console.log({products})
            return products
        }catch(error){
            return error;
        }
    }

    async getProductById(id){
        try{
            const product = await productsModel.findOne({ _id: id })
            return product
        }catch(error){
            return error;
        }
    }

    async updateProduct(id, data){
        try{
            const updatedProduct = await productsModel.updateOne({_id: id}, data)
            return updatedProduct
        } catch(error){
            return error;
        }
    }

    async deleteProduct(id){
        try{
            const deletedProd = await productsModel.deleteOne({ _id: id})
            return deletedProd
        }catch(error){
            return error;
        }
    }

    validateTypeof(title, description, code, price, status, stock, category){
        if ( 
            typeof title        !== "string" || 
            typeof description  !== "string" || 
            typeof code         !== "string" || 
            typeof category     !== "string"
        ){
            throw new Error("Check that title, description, code or category are of type string")
        }
        if ( 
            typeof price !== "number" || 
            typeof stock !== "number"
        ){
            throw new Error("Check that price or stock are of type number")
        }
        if ( typeof status !== "boolean"){
            this.products[indexID].status = true;
        }
    }
} 
