const { User, Post, Token, Sequelize } = require("../models/index.js");
const { Op } = Sequelize;
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/config.json')['development']
const transporter = require("../config/nodemailer");

const UserController = {
  async register(req, res, next) {
    try {
      const user = await User.create({
        ...req.body,
        confirmed: false,
        role: "user",
      });
      const emailToken = jwt.sign({email:req.body.email},jwt_secret,{expiresIn:'48h'})
      const url = 'http://localhost:8080/users/confirm/'+ emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estas a un paso de registrarte </h3>
        <a href="${url}"> Click para confirmar tu registro</a>
        Este enlace caduda en 48h.
        `,
      });

      res.status(201).send({
        message: "Te hemos enviado un correo para confirmar el registro",
        user,
      });
    } catch (err) {
      err.origin = "User";
	  next(err)
    }
  },
  login(req,res){
    User.findOne({
        where:{
            email:req.body.email
        }
    }).then(user=>{
        if(!user){
            return res.status(400).send({message:"Usuario o contraseña incorrectos"})
        }
      
      if(!user.confirmed){
          return res.status(200).send({message:"Debes confirmar tu correo"})
      }

        const token = jwt.sign({id: user.id}, jwt_secret);
        Token.create({ token, UserId: user.id })
        res.send({message: 'Holi' + user.name, user, token})
    })
},
  getAll(req, res) {
    User.findAll({
      include: [Post],
    })
      .then((users) => res.send(users))
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Ha habido un problema al cargar las publicaciones",
        });
      });
  },
  async delete(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      await Post.destroy({
        where: {
          UserId: req.params.id,
        },
      });
      res.send("Erradicado. Con éxito.");
    } catch (error) {
      console.log(err);
      res.status(500).send({
        message:
          "Ha habido un problema al eliminar el usuario y sus publicaciones",
      });
    }
  },
  async update(req, res) {
    await User.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send("Usuario actualizado con éxito");
  },
  async logout(req, res) {
    try {
        await Token.destroy({
            where: {
                [Op.and]: [
                    { UserId: req.user.id },
                    { token: req.headers.authorization }
                ]
            }
        });
        res.send('Desconectado con éxito')
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'hubo un problema al tratar de desconectarte' })
    }
},
async confirm(req,res){
  try {
    const token = req.params.emailToken
    const payload = jwt.verify(token,jwt_secret)
    await User.update({confirmed:true},{
      where:{
        email: payload.email
      }
    })
    res.status(201).send( "Usuario confirmado con éxito" );
  } catch (error) {
    console.error(error)
  }
}
};

module.exports = UserController;
