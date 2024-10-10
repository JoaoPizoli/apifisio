const knex = require('../database/conection');

class Paciente {
    async new(nome, idade, peso, altura, genero, userId) {
        try {
            await knex('pacientes').insert({
                nome: nome,
                idade: idade,
                peso: peso,
                altura: altura,
                genero: genero,
                users_idUsers: userId 
            });
            return { status: 200 };
        } catch (error) {
            console.log(error);
            return { status: 404, err: error };
        }
    }


    async findPacienteByUserId(userId) {
        try {
            let paciente = await knex('pacientes')
                .join('users', 'pacientes.users_idUsers', '=', 'users.idUsers')
                .select('pacientes.idPaciente')
                .where('users.idUsers', userId);

            if (paciente.length > 0) {
                return { status: true, idPaciente: paciente[0].idPaciente };
            } else {
                return { status: false, message: 'Paciente não encontrado para este usuário.' };
            }
        } catch (err) {
            console.error("Erro ao buscar paciente pelo userId:", err); 
            return { status: false, message: 'Erro ao buscar paciente.', err: err };
        }
    }
    
}

module.exports = new Paciente();
