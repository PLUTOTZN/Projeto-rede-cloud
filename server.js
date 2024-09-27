const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./db'); // Importa a configura��o do MySQL
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de registro
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send('Por favor, preencha todos os campos.');
  }

  try {
    // Hash da senha com bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Inser��o no banco de dados
    connection.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      (err, results) => {
        if (err) {
          console.error('Erro ao registrar usu�rio:', err);
          return res.status(500).send('Erro no servidor');
        }
        res.status(201).send('Usu�rio registrado com sucesso!');
      }
    );
  } catch (err) {
    res.status(500).send('Erro ao registrar usu�rio');
  }
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return rwes.status(400).send('Por favor, preencha todos os campos.');
  }

  // Verifica se o usu�rio existe no banco de dados
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        console.error('Erro ao buscar usu�rio:', err);
        return res.status(500).send('Erro no servidor');
      }

      if (results.length === 0) {
        return res.status(400).send('Usu�rio n�o encontrado');
      }

      // Verifica a senha
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).send('Senha incorreta');
      }

      res.send('Login realizado com sucesso!');
    }
  );
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}
app.use(express.static('public'));
