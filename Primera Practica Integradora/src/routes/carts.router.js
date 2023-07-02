import { Router } from "express";
import { CartDBManager } from '../dao/managers/cartDBManager.js'

const router = Router();
const cartDBManager = new CartDBManager()

router.post('/', async (req, res) => {
    try {
        const statusCart = await cartDBManager.newCart();
        res.status(201).send({message: statusCart})
    } catch(error) {
        res.status(400).send({error: error.message})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        const statusAdd = await cartDBManager.addProductToCart(cid, pid)
        res.status(200).send({message: statusAdd})
    } catch(error){
        res.status(400).send({error: error.message})
    }
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const cartById = await cartDBManager.getCartsById(cid);
        res.status(200).send(cartById)
    } catch(error){
        res.status(400).send({error: error.message})
    }
})

export default router;

