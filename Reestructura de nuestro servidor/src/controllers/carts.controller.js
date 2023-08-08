import { CartDBManager } from '../dao/managers/cartDBManager.js'
import Cart from "../dao/models/cartsModel.js";

const cartDBManager = new CartDBManager();

export const createNewCart = async (req, res) => {
    try {
        const statusCart = await cartDBManager.newCart();
        res.status(201).send({message: statusCart})
    } catch(error) {
        res.status(400).send({error: error.message})
    }
};

export const addProductToCartId = async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const statusAdd = await cartDBManager.addProductToCart(cid, pid)
        res.status(200).send({message: statusAdd})
    } catch(error){
        res.status(400).send({error: error.message})
    }
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid;
    try {
        const cartById = await Cart.getCartsById(cid).populate('products');
        res.status(200).send(cartById);
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

export const deleteProductFromCartById = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const statusDelete = await cartDBManager.deleteProductFromCart(cid, pid);
        res.status(200).send({ message: statusDelete });
    } catch(error) {
        res.status(404).send({ error: error.message });
    }
}

export const updateProductsFromCartById = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const statusUpdate = await cartDBManager.updateCartProducts(cid, products);
        res.status(200).send({ message: statusUpdate });
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
}

export const updateProductQuantityInCartById = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const statusUpdate = await cartDBManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({ message: statusUpdate });
    } catch(error) {
        res.status(400).send({ error: error.message });
    }
}

export const deleteAllProductsFromCartById = async (req, res) => {
    const cid = req.params.cid;
    try {
        const statusDelete = await cartDBManager.deleteAllProductsFromCart(cid);
        res.status(200).send({ message: statusDelete });
    } catch(error) {
        res.status(404).send({ error: error.message });
    }
}