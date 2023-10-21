import productsModel from '../services/db/dao/models/productsModel.js'
import userModel from '../services/db/dao/models/usersModel.js'
import UsersManager from '../services/db/dao/managers/usersManager.js';

export class UsersController {

    usersManager;

    constructor(){
        this.usersManager = new UsersManager()
    }

    async updateUserRole (id) {
        try {
            const user = await this.usersManager.getUserByID(id);
            const requiredDocuments = ['id', 'address', 'account'];
            const userDocuments = user.documents || [];

            const hasAllDocuments = requiredDocuments.every(requiredDocument => {  
                return userDocuments.some(userDocument => userDocument.name.includes(requiredDocument))
            });

            if (!hasAllDocuments) throw new Error('User must have all documents');

            return await this.usersManager.toggleUserRole(user);
            } catch (e){
                throw new Error(e)
            }
    }

    async getUserByEmail(email){
        try{
            return await this.usersManager.getUserByEmail(email)
        } catch (e){
            res.json({ error: e})
        }
    }

    async setLastConnection(email){
        try {
            const user = await this.usersManager.getUserByEmail(email);
            if( !user ) throw new Error('User not found');
            await this.usersManager.setLastConnection(user);
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateUserDocuments (id, files){
        try {
            const user = await this.usersManager.getUserByID(id)
            const documents = user.documents || [];
            const newDocuments = [...documents,...files.map(file => ({name: file.originalname, referece: file.path}))];
            return await user.updateOne({ documents : newDocuments});
        } catch (e) {
            res.json({ error: e});
        }
    }
}


export const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next(); 
        } else {
            res.status(403).send({ status: "error", error: "Access denied" });
        }
    };
};

export const checkProductPermissions = async (req, res, next) => {
    const productId = req.params.pid;
    const userEmail = req.user.email;
    try {
        const product = await productsModel.findById(productId);
        if (!product) {
            return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
        }
        if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner === userEmail)) {
            next(); 
        } else {
            return res.status(403).send({ status: 'error', error: 'No tienes permiso para realizar esta acción' });
        }
    } catch (error) {
        return res.status(500).send({ status: 'error', error: 'Error en el servidor' });
    }
};

export const changeOfRol = async (req, res) => {
    const userId = req.params.uid;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();
        return res.send({ status: 'success', message: 'Rol de usuario actualizado exitosamente' });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: 'Error en el servidor' });
    }
}

export const isAdminOrPremium = async (req, res, next) => {
    const allowedRoles = ['admin', 'premium'];
    if (allowedRoles.includes(req.user.user.role)){
        return next()
    }
    req.logger.warning('No tiene permisos')
    res.status(400).send("El producto no se puede eliminar porque el producto no es propio o no tiene suficientes permisos")
}

 

export const isOwnProduct = async (req, res, next) => {

    if(req.user.user.role === 'admin') return next();

    const { email } = req.user.user
    const { pid } = req.params
    if(!pid) res.status(400).send("Es necesario un product id")

    const prod = await product_repository.getProductById(pid)
    const owner_email = prod._doc.owner.createdBy
    if(email === owner_email){
        return next()
    }
    req.logger.warning('No tiene permisos')
    res.status(400).send("El producto no se puede agregar porque el producto no es propio")
}

