import { CartDBManager } from '../services/db/dao/managers/cartDBManager.js';
import Cart from "../services/db/dao/models/cartsModel.js";
import Ticket from "../services/db/dao/models/ticketsModel.js";
import Product from "../services/db/dao/models/productsModel.js";
import { generateUniqueCode } from "../utils.js";

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
    const userEmail = req.user.email;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).send({ status: 'error', error: 'Product not found' });
        }
        if (product.owner === userEmail) {
            return res.status(403).send({ status: 'error', error: 'You cannot add your own product to the cart' });
        }
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

export const calculateTotalAmount = async (productIds) => {
    let totalAmount = 0;

    for (const productId of productIds) {
        const product = await Product.findById(productId);
        if (product) {
            totalAmount += product.price;
        }
    }

    return totalAmount;
};

export const finalizePurchase = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const productsNotPurchased = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productID);
            const requestedQuantity = item.quantity;

            if (product && product.stock >= requestedQuantity) {
                product.stock -= requestedQuantity;
                await product.save();
            } else {
                productsNotPurchased.push(item.productID);
            }
        }

        if (productsNotPurchased.length > 0) {
 
            const ticketData = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: await calculateTotalAmount(productsNotPurchased),
                purchaser: req.session.user.email,
                products: productsNotPurchased,
            };

            await Ticket.create(ticketData);
        }

        cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.productID));
        await cart.save();

        res.send({ status: "success", message: "Purchase process completed" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

