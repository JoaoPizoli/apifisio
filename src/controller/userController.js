const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsersController {
    async create(req, res) {
        let { nome, email, password, cpf } = req.body;
        let result = await User.new(nome, email, password, cpf);
        
        result.status
        ? res.status(200).json({ success: true, message: "Usuário Cadastrado com Sucesso" })
        : res.status(404).json({ success: false, message: result.err });
    }

    async login(req, res) {
        let { email, password } = req.body;

        let user = await User.findByEmail(email);

        if (user.status === undefined || !user.status) {
            user.status === undefined
            ? res.status(404).json({ success: false, message: user.message })
            : res.status(400).json({ success: user.status, message: user.err });
        } else {
            let isPassword = await bcrypt.compare(password, user.values.password);
            if (!isPassword) {
                res.status(406).json({ success: isPassword, message:'Senha Inválida!' });
            } else {
                let token = jwt.sign(
                    { id: user.values.idUsers, email: user.values.email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: 3600 }
                );
                res.status(200).json({ success: true, token: token });
            }
        }
    }


    async delete(req,res){
        let idUsers = req.params.idUsers

        if(isNaN(idUser)){
            return res.status(404).json({sucess: false, message:'Parametro Inválido'})
        }else{
            let result = await User.deleteUser(idUsers)
            result.status
            ? res.status(200).json({sucess: result.status, message: result.message})
            : res.status(406).json({sucess: result.status, message: result.err})
        }
    }
}

module.exports = new UsersController();
