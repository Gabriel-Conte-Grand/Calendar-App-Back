/*
  ---  RUTAS DE /API/AUTH  ---
*/ 

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();


const { validarCampos } = require('../middlewares/validarCampos');
const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validarJWT');



router.post('/new', 
    [ // middlewares de validación!
        check('name', 'Name is needed').not().isEmpty(),
        check('email', 'Email is needed').isEmail(),
        check('password', 'Password minimum of characters is 6').isLength({ min : 6 }),
        validarCampos
    ],
     
    crearUsuario)

router.post('/',
    [ // middlewares de validacion!
    check('email', 'Email is needed').isEmail(),
    check('password', 'Password minimum of characters is 6').isLength({ min : 6 }),
    validarCampos
    ] ,
     loginUsuario)


router.get('/renew', validarJWT,  revalidarToken)






module.exports = router