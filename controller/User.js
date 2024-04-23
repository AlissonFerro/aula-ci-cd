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
            if(!user) return res.status(404).send({ message: 'User not found' });
            if(user._id != id) return res.status(404).send({ message: 'User not found' });

            return res.status(200).send(user);
        } catch (error) {
            console.log(error);
            return res.status(500).send({message: error.message})
        }
    }
    static async create(req, res){
        const { name, lastname, salary } = req.body;
        if(!name) return res.status(400).send({message: 'Name is require'});
        if(!lastname) return res.status(400).send({ message: 'Lastname is require' })
        if(name.length < 3) return res.status(400).send({ message: 'Name is shorter than 3 characteres' });
        if(lastname.length < 3) return res.status(400).send({ message: 'Lastname is shorter than 3 characteres' });
        try {
            const user = {
                name, lastname, salary
            };
            await User.create(user);
            return res.status(201).send(user)
        } catch (error) {
            
        }
    }

    static async update(req,res){
        const { id } = req.params;
        const {name, lastname, salary} = req.body;
        if(!name) return res.status(400).send({message: 'Name is require'});
        if(!lastname) return res.status(400).send({message: 'Lastname is require'});

        try {
            const user = await User.findById(id);
            if(user._id != id) return res.status(404).send({ message: 'User not found' });

            user.name = name;
            user.lastname = lastname;
            user.salary = salary;
            
            await User.findByIdAndUpdate(id, user);

            return res.status(200).send(user);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: error.message })
        }
    }

    static async delete(req, res){
        const { id } = req.params;

        try {
            const user = await User.findById(id);
            if(!user) return res.status(404).send({ message: 'User not found' });
            await User.findByIdAndDelete(id);
            return res.status(200).send({message: 'User deleted successfuly'})
        } catch (error) {
            return res.status(500).send({ message: error.message })
        }

    }
}

module.exports = UserController;