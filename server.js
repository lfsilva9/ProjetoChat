
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const WebSocket = require('ws');

const PORT = 3000;

// Arquivo onde o histórico será armazenado
const dataDir = path.join(__dirname, 'data');
const messagesFile = path.join(dataDir, 'messages.json');

// Cria a pasta data caso ela não exista
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Recupera o histórico salvo
let history = [];

try {
    if (fs.existsSync(messagesFile)) {
        history = JSON.parse(
            fs.readFileSync(messagesFile, 'utf8')
        );

        if (!Array.isArray(history)) {
            history = [];
        }
    }
} catch (error) {
    console.log('Erro ao carregar o histórico:', error.message);
    history = [];
}

// Salva as mensagens no arquivo JSON
function saveHistory() {
    try {
        fs.writeFileSync(
            messagesFile,
            JSON.stringify(history, null, 2),
            'utf8'
        );
    } catch (error) {
        console.log('Erro ao salvar mensagens:', error.message);
    }
}

// Servidor HTTP
const server = http.createServer((request, response) => {
    let pathname = url.parse(request.url).pathname;

    if (pathname === '/') {
        pathname = '/chat.html';
    }

    try {
        pathname = decodeURIComponent(pathname);
    } catch (error) {
        response.writeHead(400);
        response.end('Endereco invalido!');
        return;
    }

    const root = path.resolve(__dirname);
    const arquivo = path.resolve(root, '.' + pathname);

    // Impede acesso a arquivos fora da pasta do projeto
    if (arquivo !== root &&
        arquivo.indexOf(root + path.sep) !== 0) {
        response.writeHead(403);
        response.end('Acesso negado!');
        return;
    }

    fs.readFile(arquivo, (erro, conteudo) => {
        if (erro) {
            response.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8'
            });
            response.end('Pagina invalida!');
            return;
        }

        const tipoArquivo = mime.lookup(arquivo) ||
            'application/octet-stream';

        response.writeHead(200, {
            'Content-Type': tipoArquivo
        });

        response.end(conteudo);
    });
});

server.listen(PORT, () => {
    console.log('Servidor iniciado!');
    console.log('Acesse: http://localhost:' + PORT);
});

// Gerenciamento das conexões WebSocket
const wsServer = new WebSocket.Server({
    server: server
});

const users = [];

const colors = [
    'green', 'yellow', 'blue', 'purple',
    'pink', 'lime', 'amber', 'orange'
];

wsServer.on('connection', (ws) => {

    const user = {
        socket: ws,
        nome: '',
        cor: colors[Math.floor(Math.random() * colors.length)]
    };

    users.push(user);

    // Envia o histórico para o novo usuário
    history.forEach((item) => {
        ws.send(JSON.stringify({
            type: 'show-message',
            message: item.message,
            sender: item.sender,
            color: item.color,
            side: 'right'
        }));
    });

    // Solicita o nome do usuário
    ws.send(JSON.stringify({
        type: 'show-message',
        message: 'Envie seu nome!',
        sender: 'Servidor',
        color: 'red',
        side: 'right'
    }));

    // Recebe mensagens do usuário
    ws.on('message', (message) => {

        let json;

        try {
            json = JSON.parse(message.toString());
        } catch (error) {
            console.log('Mensagem invalida recebida.');
            return;
        }

        // Define o nome do usuário
        if (json.type === 'set-name') {

            const nome = String(json.message || '').trim();

            if (nome === '') {
                return;
            }

            user.nome = nome;

            ws.send(JSON.stringify({
                type: 'show-message',
                message: 'Seja Bem Vindo ' + user.nome + '!',
                sender: 'Servidor',
                color: user.cor,
                side: 'right'
            }));

            users.forEach((each) => {
                if (each.socket !== ws &&
                    each.socket.readyState === WebSocket.OPEN) {

                    each.socket.send(JSON.stringify({
                        type: 'show-message',
                        message: user.nome + ' entrou no chat!',
                        sender: 'Servidor',
                        color: user.cor,
                        side: 'right'
                    }));
                }
            });
        }

        // Recebe e distribui mensagens
        else if (json.type === 'set-message') {

            if (user.nome === '') {
                return;
            }

            const texto = String(json.message || '').trim();

            if (texto === '') {
                return;
            }

            const novaMensagem = {
                sender: user.nome,
                message: texto,
                color: user.cor,
                timestamp: new Date().toISOString()
            };

            // Adiciona a mensagem ao histórico
            history.push(novaMensagem);

            // Persiste o histórico no arquivo JSON
            saveHistory();

            // Envia a mensagem para todos os usuários
            users.forEach((each) => {

                if (each.socket.readyState === WebSocket.OPEN) {

                    const lado = each.socket === ws
                        ? 'left'
                        : 'right';

                    each.socket.send(JSON.stringify({
                        type: 'show-message',
                        message: novaMensagem.message,
                        sender: novaMensagem.sender,
                        color: novaMensagem.color,
                        side: lado
                    }));
                }
            });
        }
    });

    // Remove o usuário quando desconectar
    ws.on('close', () => {

        const index = users.indexOf(user);

        if (index !== -1) {
            users.splice(index, 1);
        }

        console.log('Usuario desconectado:', user.nome);
    });

    ws.on('error', (error) => {
        console.log('Erro WebSocket:', error.message);
    });
});
