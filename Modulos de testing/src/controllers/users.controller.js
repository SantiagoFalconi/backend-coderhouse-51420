import productsModel from '../services/db/dao/models/productsModel.js'
import userModel from '../services/db/dao/models/usersModel.js'

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