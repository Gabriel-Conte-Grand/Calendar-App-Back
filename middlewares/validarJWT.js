
const { response } = require('express')
const jwt = require('jsonwebtoken')



const validarJWT = ( req , res=response, next ) => {

    //
    const token = req.header('x-token');

    //validar tokens
    //si no existe..
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'Token needed on request'
        })
    }

    //si la validacion falla...(no son iguales)

    try {

        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT
        )
        //creo el uid y name con el token q me pasaron
        req.uid = payload.uid
        req.name = payload.name


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'No valid token'
        })
    }

    next()

}



module.exports = { validarJWT }

