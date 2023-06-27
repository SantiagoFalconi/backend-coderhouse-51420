import { Router } from "express";
import productsModel from "../dao/models/products.js";

const router = Router();

router.get('/', async (req,res) =>{
    const products = await productsModel.find({});
    res.send({products});
})

router.get('/:id', async (req,res) =>{
    const id = req.params;
    const product = await productsModel.findOne({_id:id});
    res.send({product});
})

router.delete('/:id', async (req,res) =>{
    const id = req.params;
    const result = await productsModel.deleteOne({_id:id});
    res.send({result});
})

router.post('/:id', async (req,res) =>{
    let {title,description,price,thumbnail,code,stock,status,category} = req.body;
    if(!title||!description||!price||!thumbnail||!code||!stock||!status||!category)
    return res.send({status:"error",error:"Incomplete values"});

    let result = await productsModel.create({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
    });
    res.send({status:"success",payload:result})
})

router.put('/:uid', async (req,res) =>{
    let {uid} = req.params;
    let pToReplace = req.body;
    if(!pToReplace.title||!pToReplace.description||!pToReplace.price||!pToReplace.thumbnail||!pToReplace.code||!pToReplace.stock||!pToReplace.status||!pToReplace.category)
    return res.send({status:"error", error: "Incomplete Values"})

    let result = await productsModel.updateOne({_id:uid},pToReplace)
    res.send({status: "success",payload:result})
});

export default router;


