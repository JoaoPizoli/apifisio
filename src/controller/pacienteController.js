const Paciente = require('../models/paciente');

class PacienteController {
    async create(req, res) {
        const { nome, idade, peso, altura, genero } = req.body;
        const userId = req.user.id; 

        let result = await Paciente.new(nome, idade, peso, altura, genero, userId);

        result.status === 200
            ? res.status(200).json({ success: true, message: 'Paciente cadastrado(a) com sucesso!' })
            : res.status(404).json({ success: false, message: result.err });
    }
}

module.exports = new PacienteController();
