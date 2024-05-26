const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(bodyParser.json())

const users = []
const messages = []




// rota
app.get('/', (req, res) => {
    res.status(200).send('bem vindo')
})




// criando usuario
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    if (!name) {
        return res.status(400).send('verifique seu nome')
    }
    if (!email) {
        return res.status(400).send('verifique seu email')
    }
    if (!password) {
        return res.status(400).send('verifique sua senha')
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).send('email já cadastrado, insira outro:')
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    users.push(newUser)
    res.status(201).send(`bem vindo ${name}! usuário registrado com sucesso!`)
})




// Login 
app.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).send('insira um e-mail válido')
    }
    if (!password) {
        return res.status(400).send('insira uma senha válida')
    }

    const user = users.find(user => user.email === email && user.password === password)

    if (!user) {
        return res.status(404).send('email não encontrado no sistema, verifique ou crie uma conta')
    }

    res.status(200).send(`bem vindo ${user.name}! usuário logado com sucesso!`)
})






// Criando mensagem 
app.post('/message', (req, res) => {
    const { email, title, description } = req.body

    if (!title) {
        return res.status(400).send('verifique se passou o título')
    }
    if (!description) {
        return res.status(400).send('verifique se passou a descrição')
    }

    const user = users.find(user => user.email === email)

    if (!user) {
        return res.status(404).send('email não encontrado, verifique ou crie uma conta')
    }

    const newMessage = {
        id: uuidv4(),
        userId: user.id,
        title,
        description
    };

    messages.push(newMessage)
    res.status(201).send(`mensagem criada com sucesso! ${JSON.stringify(newMessage)}`)
})




// Lendo mensagens
app.get('/message/:email', (req, res) => {
    const { email } = req.params

    const user = users.find(user => user.email === email)

    if (!user) {
        return res.status(404).send('email não encontrado, verifique ou crie uma conta')
    }

    const userMessages = messages.filter(message => message.userId === user.id)

    res.status(200).send(`bem-vindo! ${JSON.stringify(userMessages)}`)
});




// Atualizando mensagem 
app.put('/message/:id', (req, res) => {
    const { id } = req.params
    const { title, description } = req.body;

    const message = messages.find(message => message.id === id)

    if (!message) {
        return res.status(404).send('informe um id válido da mensagem')
    }

    if (title) message.title = title
    if (description) message.description = description

    res.status(200).send(`mensagem atualizada com sucesso! ${JSON.stringify(message)}`)
})




// Deletando mensagem
app.delete('/message/:id', (req, res) => {
    const { id } = req.params

    const messageIndex = messages.findIndex(message => message.id === id)

    if (messageIndex === -1) {
        return res.status(404).send('mensagem não encontrada, verifique o identificador em nosso banco')
    }

    messages.splice(messageIndex, 1)
    res.status(200).send('mensagem apagada com sucesso')
})

app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`)
})
