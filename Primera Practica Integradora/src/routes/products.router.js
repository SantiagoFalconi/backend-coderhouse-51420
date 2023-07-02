import { Router } from "express";
import { ProductDBManager } from "../dao/managers/productDBManager.js";
import { io } from '../app.js'

const router = Router();
const pManager = new ProductDBManager()

router.get('/', async (req, res) => {
    const { limit } = req.query
    const products = await pManager.getProducts();
    try {
        if (!limit) {
            res.status(200).send(products)     
        } else {
            const limitProd = products.slice(0,limit)
            res.status(200).send(limitProd)
        }
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const products = await pManager.getProductById(pid)
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const bodyToUpdate = req.body
    try {
        const statusUpdate = await pManager.updateProduct(pid, bodyToUpdate)
        const products = await pManager.getProducts() 
        io.emit('updateproducts', products) 
        res.status(200).send({message: statusUpdate});
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body
    try {
        const product = await pManager.addProduct(newProduct)
        const products = await pManager.getProducts() 
        io.emit('updateproducts', products)
        res.status(201).send({product})
    } catch(error){
        res.status(400).send({error: error.message})
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const statusDelete = await pManager.deleteProduct(pid)
        const products = await pManager.getProducts() 
        io.emit('updateproducts', products)
        res.status(200).send({message: statusDelete})
    } catch(error){
        res.status(404).send({error: error.message})
    }
})

export default router;
