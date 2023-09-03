import logger from '../utils/loggers.js';

export const getLogger = (req, res) => {
    logger.debug('Este es un mensaje de nivel debug');
    logger.info('Este es un mensaje de nivel info');
    logger.warn('Este es un mensaje de nivel warning');
    logger.error('Este es un mensaje de nivel error');
    logger.fatal('Este es un mensaje de nivel fatal');
  
    res.send('Registro de niveles realizado');
  }