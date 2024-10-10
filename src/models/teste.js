const knex = require('../database/conection');

class Teste {
    async new(nome, data, descricao, numTesteMinimo, numTesteMaximo, numTestado, estadoAtual, rangeMinimo, rangeMaximo, pacientes_idPaciente,idteste) {
        try {
            
            let estadoAtual;

            if (numTestado < rangeMinimo) {
                estadoAtual = 'Abaixo do normal!';
            } else if (numTestado > rangeMaximo) {
                estadoAtual = 'Acima do normal!';
            } else {
                estadoAtual = 'Dentro dos parâmetros normais!';
            }

            await knex('testes').insert({
                nome: nome,
                data: data,
                descricao: descricao,
                numTesteMaximo: numTesteMaximo,
                numTesteMinimo: numTesteMinimo,
                numTestado: numTestado,
                rangeMinimo: rangeMinimo,
                rangeMaximo: rangeMaximo,
                estadoAtual: estadoAtual,  
                pacientes_idPaciente: pacientes_idPaciente
            });

            return { status: 200, message: 'Teste inserido com sucesso!' };
        } catch (error) {
            console.error("Erro durante a inserção no banco de dados:", error);
            return { status: 404, err: error };
        }
    }

    async findTesteById(idteste) {
        try {
            let teste = await knex.select(["nome", "numTestado", "numTesteMinimo", "numTesteMaximo", "rangeMinimo", "rangeMaximo"]).where({ idteste: idteste }).table('testes');
            return teste.length > 0 ? { status: true, values: teste } : { status: undefined, message: 'Teste Inexistente!' };
        } catch (err) {
            return { status: false, err: err };
        }
    }

    async deleteTeste(idteste) {
        let teste = await this.findTesteById(idteste);

        if (teste.status) {
            try {
                await knex.delete().where({ idteste: idteste }).table('testes');
                return { status: true, message: 'Teste excluído com sucesso!' };
            } catch (err) {
                return { status: false, err: err };
            }
        } else {
            return { status: false, err: 'Teste não existe, portanto não pode ser deletado.' };
        }
    }

    async updateTeste(idteste, nome, data, descricao, numTesteMinimo, numTesteMaximo, rangeMinimo, rangeMaximo) {
        let teste = await this.findTesteById(idteste);

        if (teste.status) {
            let updatTeste = {};

            nome != undefined ? updatTeste.nome = nome : null;
            data != undefined ? updatTeste.data = data : null;
            descricao != undefined ? updatTeste.descricao = descricao : null;
            numTesteMaximo != undefined ? updatTeste.numTesteMaximo = numTesteMaximo : null;
            numTesteMinimo != undefined ? updatTeste.numTesteMinimo = numTesteMinimo : null;
            rangeMinimo != undefined ? updatTeste.rangeMinimo = rangeMinimo : null;
            rangeMaximo != undefined ? updatTeste.rangeMaximo = rangeMaximo : null;

            
            let numTestado = teste.values[0].numTestado;

            const epsilon = 0.00001;

            if (numTestado < rangeMinimo - epsilon) {
                updatTeste.estadoAtual = "Abaixo do normal";
            } else if (numTestado > rangeMaximo + epsilon) {
                updatTeste.estadoAtual = "Acima do normal";
            } else {
                updatTeste.estadoAtual = "Aprovado";
            }

            try {
                await knex.update(updatTeste).where({ idteste: idteste }).table('testes');
                return { status: true, message: 'Teste alterado com sucesso!' };
            } catch (err) {
                return { status: false, err: err };
            }
        } else {
            return { status: false, err: 'Teste inexistente, portanto não pode ser alterado!' };
        }
    }

    async atualizarTeste(idteste, numTestado) {
        let teste = await this.findTesteById(idteste);
        if (teste.status) {
            let editTeste = {};

            let rangeMinimo = teste.values[0].rangeMinimo;
            let rangeMaximo = teste.values[0].rangeMaximo;
            let numTesteMinimo = teste.values[0].numTesteMinimo;
            let numTesteMaximo = teste.values[0].numTesteMaximo;

            const epsilon = 0.00001;

            if (numTestado < numTesteMinimo || numTestado > numTesteMaximo) {
                return { status: false, err: 'O número do teste realizado deve estar entre o mínimo e o máximo permitidos.' };
            }

            if (numTestado < rangeMinimo - epsilon) {
                editTeste.estadoAtual = "Abaixo do normal";
            } else if (numTestado > rangeMaximo + epsilon) {
                editTeste.estadoAtual = "Acima do normal";
            } else {
                editTeste.estadoAtual = "Aprovado";
            }

            editTeste.numTestado = numTestado;

            try {
                await knex.update(editTeste).where({ idteste: idteste }).table('testes');
                return { status: true, message: 'Teste atualizado com sucesso!' };
            } catch (err) {
                return { status: false, err: err };
            }

        } else {
            return { status: false, err: 'Teste inexistente, portanto não pode ser atualizado!' };
        }
    }
}

module.exports = new Teste();
