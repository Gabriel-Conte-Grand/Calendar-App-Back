//importo express , me ayuda a tener intelisense !
const { response } = require('express')

const bcrypt = require('bcryptjs')

const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/Jwt')



const crearUsuario = async(req, res = response) => {
    
    const { email, password } = req.body
    
    try{ 
        //chequear si mail existe
        
        let usuario = await Usuario.findOne({ email })
        //si ya existe el mail en la DB, rechazar
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Email already in use'
            })
        }
  
        usuario = new Usuario( req.body )
    
        //encriptar password antes de guardar en DB
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save();

        // generar JWT

        const token = await generarJWT(usuario.id, usuario.name)


        res.status(201).json({
           ok: true,
           uid : usuario.id,
           name: usuario.name,
           token
         })


    }catch(error){

        res.status(500).json({ 
            ok: false,
            msg: 'Please contact to administration'
        })

    }
}

const loginUsuario = async( req, res=response ) => {

    const { email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email })
        //si no existe el usuario de logeo
        if(!usuario){
            
            return res.status(400).json({
                ok: false,
                msg: 'User or Password incorrect'
            })
        }
        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )
        //regresa true si es válido

        if(! validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'
            })
        }

        //generear JWT

        const token = await generarJWT(usuario.id, usuario.name)




        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Please contact to administration'
        })
        

    }
        res.json({
            ok: true,
            msg: 'login',
            email,
            password     
        })
}



const revalidarToken = async( req, res=response ) => {

    const uid = req.uid
    const name = req.name

    //generar un nuevo JWT
    const  token = await generarJWT( uid, name )

    res.json({
        ok: true,
        token,
        uid,
        name
    })

}





module.exports = {crearUsuario, loginUsuario, revalidarToken}


