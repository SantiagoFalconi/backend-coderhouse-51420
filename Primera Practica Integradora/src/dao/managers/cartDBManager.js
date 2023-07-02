import cartsModel from '../models/cartsModel.js'
import productsModel from '../models/productsModel.js';

export class CartDBManager {
    
    async getCarts(){
        try{
            const carts = await cartsModel.find();
            return carts
        }catch (error){
            return error
        }
    }

    async getCartsById(id){
        try{
            const cart = await cartsModel.findOne({ _id: id})
            return cart
        }catch (error){
            return error
        }
    }

    async newCart(){
        try{
            const cartAdded = await cartsModel.create({ product: [] })
            return cartAdded
        }catch(error){
            return error
        }
    }

    async addProductToCart(cid, pid){
        try {
            const cart = await cartsModel.findById(cid)
            if(!cart){
                throw new Error('Cart not found')
            } 
            if(!pid){
                throw new Error('Product ID is required')
            }
            const product = await productsModel.findById(pid)
            if(!product){
                throw new Error(`Product doesn't exist`)
            }

            const prodInCart = cart.product.find(prod => prod.productID === pid)
            prodInCart ? prodInCart.quantity += 1 : cart.product.push({ productID: pid, quantity: 1})
            await cart.save();
            return cart;
        } catch(error){
            return error
        }
    }
}

