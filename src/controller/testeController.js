const paciente = require('../models/paciente');
const teste = require('../models/teste');

class TesteController {
    async create(req, res) {
        try {
            let { nome, data, descricao, numTesteMinimo, numTesteMaximo, numTestado, estadoAtual, rangeMinimo, rangeMaximo } = req.body;
            const userId = req.user.id;

            let pacienteResult = await paciente.findPacienteByUserId(userId);

            if (!pacienteResult.status) {
                console.error("Erro ao encontrar paciente:", pacienteResult.message);
                return res.status(400).json({ success: false, message: pacienteResult.message });
            }

            let idPaciente = pacienteResult.idPaciente;
            let result = await teste.new(nome, data, descricao, numTesteMinimo, numTesteMaximo, numTestado, estadoAtual, rangeMinimo, rangeMaximo, idPaciente);

            if (result.status === 200) {
                return res.status(200).json({ success: true, message: 'Teste adicionado com sucesso!' });
            } else {
                console.error("Erro ao adicionar teste:", result.err);
                return res.status(404).json({ success: false, message: 'Erro ao adicionar teste.', error: result.err });
            }
        } catch (err) {
            console.error("Erro ao criar teste:", err);
            return res.status(500).json({ success: false, message: 'Erro interno ao criar teste.', error: err });
        }
    }

    async alterarTeste(req, res) {
        let idteste = req.params.idteste;
        let { nome, data, descricao, numTesteMinimo, numTesteMaximo, rangeMinimo, rangeMaximo } = req.body;
        if (isNaN(idteste)) {
            return res.status(404).json({ success: false, message: "Parâmetro inválido!" });
        } else {
            let result = await teste.updateTeste(idteste, nome, data, descricao, numTesteMinimo, numTesteMaximo, rangeMinimo, rangeMaximo);
            result.status
                ? res.status(200).json({ success: result.status, message: result.message })
                : res.status(406).json({ success: result.status, message: result.err });
        }
    }

    async atualizarTeste(req, res) {
        let idteste = req.params.idteste;
        let { numTestado } = req.body;
        if (isNaN(idteste)) {
            return res.status(404).json({ success: false, message: "Parâmetro inválido!" });
        }

        let result = await teste.atualizarTeste(idteste, numTestado);
        if (result.status) {
            return res.status(200).json({ success: result.status, message: result.message });
        } else {
            return res.status(406).json({ success: result.status, message: result.err });
        }
    }


    async deletarTeste(req,res){
        let idteste = req.params.idteste
        if (isNaN(idteste)) {
            return res.status(404).json({ success: false, message: "Parâmetro inválido!" });
        }

        let result = await teste.deleteTeste(idteste)

        if(result.status){
            return res.status(200).json({ success: result.status, message: result.message });
        }else{
            return res.status(406).json({ success: result.status, message: result.err });
        }
        
    }
}

module.exports = new TesteController();
