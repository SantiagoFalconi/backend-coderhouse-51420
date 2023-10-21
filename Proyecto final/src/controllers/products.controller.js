import { io } from '../app.js';
import { ProductDBManager } from "../services/db/dao/managers/productDBManager.js";
import UsersManager from '../services/db/dao/managers/usersManager.js';
import Product from "../services/db/dao/models/productsModel.js";
import MailingService from '../services/email/mailing.js';

const pManager = new ProductDBManager();
const uManager = new UsersManager();

export const getProductsWithFilter = async (req, res) => {
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
};

export const getProductsById = async (req, res) => {
    const pid = req.params.pid
    try {
        const products = await pManager.getProductById(pid)
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
};

export const updateProductById = async (req, res) => {
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
};

export const addNewProduct = async (req, res) => {
    const newProduct = req.body
    try {
        const product = await pManager.addProduct(newProduct)
        const products = await pManager.getProducts() 
        io.emit('updateproducts', products)
        res.status(201).send({product})
    } catch(error){
        res.status(400).send({error: error.message})
    }
};

export const deleteProductById = async (req, res) => {
    const mailingService = new MailingService();
    const pid = req.params.pid;
    
        try {
            const product = await pManager.getProductById(pid);
    
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            const statusDelete = await pManager.deleteProduct(pid);
    
            if (statusDelete && product.owner) {
                const ownerEmail = product.owner;
                const owner = await uManager.findOne({ email: ownerEmail });
    
                if (owner && owner.role === 'premium') {
                    const emailContent = {
                        from: 'tpa.toyz099@gmail.com',
                        to: ownerEmail,
                        subject: 'Product removed',
                        html: `Product ${product.title} has been deleted`,
                    };
    
                    await mailingService.sendSimpleMail(emailContent);
                }
            }
    
            const products = await pManager.getProducts();
            io.emit('updateproducts', products);
    
            return res.status(200).send({ message: statusDelete });
        } catch (error) {
            return res.status(404).send({ error: error.message });
        }
};
