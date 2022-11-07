const { Post, User, Sequelize } = require("../models/index.js");
const { Op } = Sequelize;
const PostController = {
  create(req, res) {
    Post.create({ ...req.body })
      .then((post) =>{    
        res.status(201).send({ message: "Publicación creada con éxito", post })
      })
      .catch(error => {
        error.origin = "Post"
        next(error)
      });
  },
  getAll(req, res) {
    Post.findAll()
      .then((posts) => res.send(posts))
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Ha habido un problema al cargar las publicaciones",
        });
      });
  },
  getById(req, res) {
    Post.findByPk(req.params.id, {
      include: [User],
    })
      .then((post) => res.send(post))
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Ha habido un problema al cargar la publicación",
        });
      });
  },
  getByName(req, res) {
    Post.findAll({
      where: {
        title: {
          [Op.like]: `%${req.params.title}%`,
        },
      },
      include: [User],
    })
      .then((post) => res.send(post))
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Ha habido un problema al cargar la publicación",
        });
      });
  },
  async delete(req, res) {
    try {
      await Post.destroy({
        where: {
          id: req.params.id,
        },
      })
      res.send("La publicación ha sido eliminada con éxito");
    } catch (error) {
      console.log(error)
    }
  },
  async update(req, res) {
    try {
      await Post.update(
        { ...req.body },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.send("Post actualizado con éxito");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "No ha sido posible actualizado el post" });
    }
  },

};

module.exports = PostController;
