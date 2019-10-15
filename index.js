const express = require('express');
const server = express();

// lista de projetos
var projetos = [];
var qtdRequisicoes = 0;

server.use(express.json());

server.use((req, res, next) => {
  // conta quantas requisicoes teve ao tovo
  qtdRequisicoes += 1;
  console.log(`Quantidade de Requisições: ${qtdRequisicoes}`);

  return next();
})

// middleware para checagem de ID na rota
function middlewareIdExists(req, res, next) {

  const { id } = req.params;
  var item = projetos.filter(item => item.id == id);
  if (!item) {
    return res.status(400).json({ error: 'Projeto inexistente!' });
  }

  req.projeto = item[0];
  return next();
}

// rota para listar os projetos
server.get('/projects', (req, res) => {
  return res.json(projetos);
});

// rota para salvar projeto e tarefas
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  projetos.push({ id: id, title: title, tasks: [] });

  return res.json(projetos);
});

// rota para adicionar nova tarefa ao projeto
server.post('/projects/:id/tasks', middlewareIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // projetos.map(item => {
  //   if (item.id = id) {
  //     item.tasks = [...item.tasks, title];
  //   }
  //   return item;
  // });

  req.projeto.tasks = [...req.projeto.tasks, title];

  return res.json(projetos);
});

// rota para editar dados do projeto
server.put('/projects/:id', middlewareIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  req.projeto.title = title;
  return res.json(projetos);

  // projetos.map(item => {
  //   if (item.id == id) {
  //     item.title = title
  //   }
  //   return item;
  // });
});

// rota para excluir o projeto
server.delete('/projects/:id', middlewareIdExists, (req, res) => {

  const { id } = req.params;

  var dados = projetos.filter(item => {
    return item.id != id;
  });

  projetos = dados;
  return res.status(400).send();
});


server.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
})