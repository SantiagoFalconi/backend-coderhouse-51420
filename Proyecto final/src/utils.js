import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateUniqueCode = async function() {
    const saltRounds = 10;
    const uniqueString = Date.now().toString() + Math.random().toString();
    const hash = await bcrypt.hash(uniqueString, saltRounds);
    const truncatedHash = hash.substring(0, 10);
    return truncatedHash;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;