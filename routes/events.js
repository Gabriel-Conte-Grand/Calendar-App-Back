
const { Router } = require('express')
const { check } = require('express-validator')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validarCampos')
const router = Router()
const { validarJWT }= require('../middlewares/validarJWT')

//creo middleware para validacion del jwt
//ahora, en todas las peticiones se ejecuta la validacion

router.use( validarJWT )


router.get('/', getEventos)


router.post('/',
    [
        check('title', 'Title is needed').not().isEmpty(),
        check('start', 'Start Date is needed').custom( isDate ),
        check('end', 'End Date is needed').custom( isDate ),       
        validarCampos
    ] ,
     crearEvento)


router.put('/:id',  actualizarEvento )


router.delete('/:id',  eliminarEvento)




module.exports = router
