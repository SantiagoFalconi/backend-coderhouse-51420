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

    async deleteProductFromCart(cid, pid) {
        try {
          const cart = await cartsModel.findById(cid);
          if (!cart) {
            throw new Error('Cart not found');
          }
      
          const productIndex = cart.products.findIndex((prod) => prod.productID === pid);
          if (productIndex === -1) {
            throw new Error('Product not found in cart');
          }
      
          cart.products.splice(productIndex, 1);
          await cart.save();
          return 'Product removed from cart successfully';
        } catch (error) {
          return error;
        }
      }
      
      async updateCartProducts(cid, products) {
        try {
          const cart = await cartsModel.findById(cid);
          if (!cart) {
            throw new Error('Cart not found');
          }
      
          cart.products = products;
          await cart.save();
          return 'Cart products updated successfully';
        } catch (error) {
          return error;
        }
      }
      
      async updateProductQuantity(cid, pid, quantity) {
        try {
          const cart = await cartsModel.findById(cid);
          if (!cart) {
            throw new Error('Cart not found');
          }
      
          const product = cart.products.find((prod) => prod.productID === pid);
          if (!product) {
            throw new Error('Product not found in cart');
          }
      
          product.quantity = quantity;
          await cart.save();
          return 'Product quantity updated successfully';
        } catch (error) {
          return error;
        }
      }
      
      async deleteAllProductsFromCart(cid) {
        try {
          const cart = await cartsModel.findById(cid);
          if (!cart) {
            throw new Error('Cart not found');
          }
      
          cart.products = [];
          await cart.save();
          return 'All products removed from cart successfully';
        } catch (error) {
          return error;
        }
      }
}

