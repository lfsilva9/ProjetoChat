# Chat em Tempo Real — Node.js

> Chat - Aula 08 - Desenvolvimento Voltado à Web III - UNIGRAN

## Descrição

Aplicação web de chat desenvolvida com Node.js e WebSocket, permitindo que vários usuários conectados ao servidor troquem mensagens em tempo real.

O projeto utiliza como base o material disponibilizado na Aula 08, com implementação adicional de persistência das mensagens em arquivo JSON.

## Instalação

Entre na pasta `chat`:

```sh
cd chat
```

Instale as dependências:

```sh
npm install
```

## Exemplo de utilização

Para iniciar o servidor HTTP e WebSocket, execute:

```sh
npm start
```

Também é possível iniciar diretamente com:

```sh
node server.js
```

Para iniciar em modo de desenvolvimento:

```sh
npm run dev
```

## Acesso à aplicação

No navegador, acesse:

```text
http://localhost:3000
```

Cada janela ou instância do navegador representa um usuário conectado ao chat.

A primeira mensagem enviada pelo usuário será utilizada como seu nome no chat. Após a identificação, o servidor encaminha as mensagens aos demais usuários conectados.

## Tecnologias utilizadas

- Node.js
- JavaScript
- HTTP
- WebSocket (ws)
- HTML
- CSS
- Materialize CSS
- jQuery
- JSON

## Persistência das mensagens

As mensagens são armazenadas no arquivo:

```text
data/messages.json
```

Cada registro contém:

- Nome do remetente;
- Conteúdo da mensagem;
- Cor associada ao usuário;
- Data e horário do envio.

O histórico é recuperado quando o usuário se conecta novamente, permanecendo disponível mesmo após a reinicialização do servidor.

## Funcionalidades

- Conexão de múltiplos usuários.
- Comunicação bidirecional em tempo real.
- Identificação dos participantes.
- Envio e recebimento de mensagens.
- Notificação de entrada de usuários.
- Armazenamento das mensagens em arquivo JSON.
- Recuperação do histórico de conversas.

## Testes realizados

- Inicialização do servidor HTTP.
- Conexão de clientes por WebSocket.
- Comunicação entre dois usuários simultaneamente.
- Gravação das mensagens no arquivo JSON.
- Recuperação do histórico após reiniciar o servidor.
- Inclusão de novas mensagens sem apagar as anteriores.

## Objetivo do projeto

Projeto desenvolvido para fins acadêmicos, com o objetivo de aplicar os conceitos de Node.js, servidor HTTP, WebSocket e persistência de dados em uma aplicação web.

## Conclusão

O desenvolvimento do projeto permitiu aplicar na prática
os conceitos de Node.js, servidor HTTP e WebSocket,
implementando uma comunicação em tempo real entre
múltiplos usuários e o armazenamento persistente das
mensagens em arquivo JSON.