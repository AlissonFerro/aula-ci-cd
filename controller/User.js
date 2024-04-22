const User = require('../models/User');

class UserController{
    static async getAll(req,res){
        try {
            const users = await User.find({}, {_id: false, __v:false});
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send({ message: error.message })
        }
    }
    static async getById(req,res){
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send({message: error.message})
        }
    }
    static async create(req, res){
        const { name, lastname, salary } = req.body;
        try {
            const user = {
                name, lastname, salary
            };
            await User.create(user);
            return res.status(201).send(user)
        } catch (error) {
            
        }
    }
}

module.exports = UserController;