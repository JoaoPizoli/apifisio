const knex = require('../database/conection');
const bcrypt = require('bcryptjs');

class User {
    async new(nome, email, password, cpf) {
        try {
            let salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(password, salt);
            await knex.insert({
                nome: nome,
                email: email,
                password: hashedPassword, 
                cpf: cpf
            }).table('users');

            return { status: true };
        } catch (err) {
            return { status: false, err: err };
        }
    }

    async findByEmail(email) {
        try {
            let user = await knex.select(["idUsers", "email", "password"])
                                .where({ email: email })
                                .table('users');
            return user.length > 0
                ? { status: true, values: user[0] }
                : { status: undefined, message: 'E-mail Inexistente' };
        } catch (err) {
            return { status: false, err: err };
        }
    }


    async deleteUser(idUsers){
        try {
            let user = await knex.delete().where({idUsers: idUsers}).table('users')
            return {status: true, message: 'Usuario Excluido com Sucesso!'}
        } catch (err) {
            return {status: false, err: err}
        }
    }
}

module.exports = new User();
