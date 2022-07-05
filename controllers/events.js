const { response } = require('express')
const Evento = require('../models/Evento')

const getEventos = async (req, res = response) => {
  //guardo eventos en una var y los envio

  const eventos = await Evento.find().populate('user', 'name')
  //agregue el name a la respuesta

  res.json({
    ok: true,
    eventos,
  })
}

const crearEvento = async (req, res) => {
  const evento = new Evento(req.body)

  try {
    evento.user = req.uid

    const eventoGuardado = await evento.save()

    res.json({
      ok: true,
      evento: eventoGuardado,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contact to administration',
    })
  }
}

const actualizarEvento = async (req, res) => {
  const eventoID = req.params.id
  const uid = req.uid

  try {
    //chequeo q el evento exista en la DB segun su ID
    const evento = await Evento.findById(eventoID)

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: `ID doesn't match with any Event`,
      })
    }
    //solo el usuario puede modificar su evento
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Not allowed to change this event',
      })
    }

    const NuevoEvento = {
      ...req.body,
      user: uid,
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoID,
      NuevoEvento
    )

    res.json({
      ok: true,
      evento: eventoActualizado,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      ok: false,
      msg: 'Contact to administration',
    })
  }
}

const eliminarEvento = async (req, res) => {
  const eventoID = req.params.id
  const uid = req.uid

  try {
    //chequeo q el evento exista en la DB segun su ID
    const evento = await Evento.findById(eventoID)

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: `ID doesn't match with any Event`,
      })
    }
    //solo el usuario puede modificar su evento
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Not allowed to delete this event',
      })
    }

    const eventoBorrado = await Evento.findByIdAndDelete(eventoID)

    res.json({
      ok: true,
      evento: eventoBorrado,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      ok: false,
      msg: 'Contact to administration',
    })
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
}
