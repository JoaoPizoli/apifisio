const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const TesteController = require('../controller/testeController');
const PacienteController = require('../controller/pacienteController');
const authAdmin = require('../middlewares/authAdm');
const revokedTokens = require('../middlewares/tokenmanager'); 
const testeController = require('../controller/testeController');
const userController = require('../controller/userController');

// Rotas de Criação
router.post('/teste',authAdmin, TesteController.create);
router.post('/paciente', authAdmin, PacienteController.create);
router.post('/user', UserController.create);

// Rota de Login
router.post('/login', UserController.login);

//Rotas de Delete
router.delete('/teste/delete/:idteste',authAdmin,testeController.deletarTeste)
router.delete('/user/delete/:idUser',authAdmin,userController.delete)


// Rotas de teste
router.put('/teste/alterar/:idteste',authAdmin, TesteController.alterarTeste);
router.put('/teste/atualizar/:idteste',authAdmin, TesteController.atualizarTeste);

// Rota de Logout
router.post('/logout', authAdmin, (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    revokedTokens.add(token); 
    res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
});

module.exports = router;
