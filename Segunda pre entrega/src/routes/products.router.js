import { Router } from "express";
import { ProductDBManager } from "../dao/managers/productDBManager.js";
import { io } from '../app.js'
import Product from "../dao/models/productsModel.js";

const router = Router();
const pManager = new ProductDBManager()

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
  
    try {
      const filter = {};
      if (query) {
        filter.$or = [
          { category: query },
          { status: query === 'available' ? true : false }
        ];
      }
  
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : null
      };
  
      const result = await Product.paginate(filter, options);
  
      const totalPages = result.totalPages;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevLink = result.hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
      const nextLink = result.hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;
  
      const payload = result.docs;
  
      res.status(200).send({
        status: 'success',
        payload,
        totalPages,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      });
    } catch (error) {
      res.status(400).send({ status: 'error', error: error.message });
    }
  });

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
