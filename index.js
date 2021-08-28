//baixar: npm i express
const express = require("express");// importa o módulo express do nde_modules
const mongoose = require('./database');
const jogoSchema = require('./models/Jogo');

const app = express();// cria o nosso objeto app, que vai poder utilizar tudo o que o express possui

app.use(express.json());// Converte requisições e repostas para JSON (JavaScript Object Notation)

const port = 3000;  

// Função responsável por filtrar apenas os jogos que possuem valores válidos, ou seja, não são null.
const getJogosValidos = () => jogoSchema.filter(Boolean);

// Função responsável por fazer o getById de jogos:
const getJogoById = async id => await jogoSchema.findById(id); 

// Função responsável por fazer o getByIndex de jogos:
const getJogoIndexById = id => getJogosValidos().findIndex(jogo => jogo.id === id)

//CRUD - Create[POST] - Read[GET] - Update[PUT] - Delete[DELETE]

//GET- /home - pagina inicial index
app.get('/', (req, res) => {
    // rota de GET, recebe o nome da rota e uma função de callback com requisição ao servidor e resposta do servidor.
    res.status(200).send('Pagina inicial - home')
});

//GET - /jogos - lista todos os jogos
app.get('/jogos', async (req, res) => {
    const jogo = await jogoSchema.find();
    res.send(jogo);
});

//GET - /jogos/{id} - lista os jogos pelo ID
app.get('/jogos/:id', async (req, res) => {
     // Rota com recebimento de parametro (:id)
    const id = req.params.id;
    const jogo = await getJogoById(id)

    !jogo
    ? res.status(404).send({ error: "Isto non ecxiste!" })
    : res.send({ jogo });
});
//POST - /jogos - criar um nvo jogo
app.post('/jogos', async (req, res) => {
    const jogo = req.body;

    if(!jogo || !jogo.nome || !jogo.imagem){
        res.status(400).send({error: 'jogo invalido'});
        return;
    }

    const novoJogo = await new jogoSchema(jogo).save();
    res.status(201).send({novoJogo});
});

//PUT - /jogos/{id} - alteração de um jogo pelo ID
app.put('/jogos/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(422).send({error: 'id invalido'});
        return;
    }

    const jogo = await jogoSchema.findById(id);

    if(!jogo){
        res.status(404).send({erro: 'jogo nao encontrado'});
        return;
    }

    novoJogo = req.body;

    if (!jogo || !jogo.nome || !jogo.imagem) {
        res.status(400).send({ error: "jgo invalido" });
        return;
    }

    //procura um document pelo id no banco e altera o docunt inteiro
    await jogoSchema.findOneAndUpdate({_id: id}, novoJogo);
    //busca o document atualizado no banco e insere na const filmeAtualizado
    const jogoAtualizado = await jogoSchema.findById(id);

    res.send({jogoAtualizado});
});

//DELETE - /jogos/{id} - apaga um jogo pelo ID
app.delete('/jogos/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(422).send({error: 'id invalido'});
        return;
    }

    const jogo = await jogoSchema.findById(id);

    if(!jogo){
        res.status(404).send({erro: 'jogo nao encontrado'});
        return;
    }

    await jogoSchema.findByIdAndDelete(id);
    res.send({message: 'jogo excluido'});
});

/* 
A função listen do objeto app serve para "ligar" o nosso back-end ou servir o nosso back-end
É obrigatório que essa chamada de função esteja SEMPRE no final do nosso código! */
app.listen(port, () => {
    console.log(`Server cool in http://localhost:${port}`);
})