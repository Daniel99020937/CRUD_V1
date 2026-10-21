class TaskController {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  // LISTAR: Listar tarefas com paginação e busca
  async list(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const status = req.query.status || 'todas';
    const busca = req.query.search ? `%${req.query.search.trim()}%` : null;

    let condicoes = [];
    let queryParams = [];

    if (status === 'pendentes') condicoes.push('t.concluida = 0');
    else if (status === 'concluidas') condicoes.push('t.concluida = 1');

    if (busca) {
      condicoes.push('t.descricao LIKE ?');
      queryParams.push(busca);
    }

    const sqlFiltro = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
    const mainSql = `
      SELECT t.*, u.nome AS criador_nome 
      FROM tarefas t 
      LEFT JOIN usuarios u ON t.usuario_id = u.id 
      ${sqlFiltro} 
      ORDER BY t.id DESC LIMIT ? OFFSET ?
    `;

    this.db.query(mainSql, [...queryParams, limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      this.db.query(`SELECT COUNT(*) AS total FROM tarefas t ${sqlFiltro}`, queryParams, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const totalItens = countResult && countResult[0] ? (countResult[0].total || countResult[0]['COUNT(*)']) : 0;
        const totalPaginas = Math.ceil(totalItens / limit) || 1;

        res.json({
          tarefas: results,
          paginacao: { totalItens, totalPaginas, paginaAtual: page, limite: limit }
        });
      });
    });
  }

  // CRIAR: Registrar nova tarefa técnica
  async create(req, res) {
    const { descricao, usuario_id } = req.body;
    const idUsuarioValido = usuario_id || 1;

    if (!descricao || descricao.trim() === '') {
      return res.status(400).json({ error: 'Descrição vazia.' });
    }

    const sql = 'INSERT INTO tarefas (descricao, concluida, criado_em, usuario_id, atualizado_por) VALUES (?, 0, NOW(), ?, ?)';
    this.db.query(sql, [descricao, idUsuarioValido, idUsuarioValido], (err, r) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: r.insertId, descricao, concluida: 0 });
    });
  }

  // ATUALIZAR: Trata o Checkbox e a Edição Inline sem estourar Erro 500
  async update(req, res) {
    const { id } = req.params;
    const { descricao, concluida, atualizado_por } = req.body;
    
    const estadoConcluida = concluida !== undefined ? Number(concluida) : 0;
    const idModificador = atualizado_por || 1;

    // Busca os dados atuais da tarefa caso algum campo venha omitido pelo front-end
    this.db.query('SELECT * FROM tarefas WHERE id = ?', [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tarefa não encontrada.' });

      const textoFinal = descricao !== undefined ? descricao.trim() : rows[0].descricao;

      const sqlUpdate = `
        UPDATE tarefas 
        SET descricao = ?, concluida = ?, concluido_em = CASE WHEN ? = 1 THEN NOW() ELSE NULL END, atualizado_por = ? 
        WHERE id = ?
      `;

      this.db.query(sqlUpdate, [textoFinal, estadoConcluida, estadoConcluida, idModificador, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tarefa auditada com sucesso!' });
      });
    });
  }

  // DELETAR: Remove o card de forma isolada e segura
  async delete(req, res) {  
    const { id } = req.params;
    this.db.query('DELETE FROM tarefas WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Tarefa removida do ecossistema.' });
    });
  }
}

module.exports = TaskController;
  async salvarEdicaoInline(li, tarefa) {
    const input = document.getElementById(`input-edit-${tarefa.id}`);
    if (!input || input.value.trim() === '') return;
    const novoTexto = input.value.trim();
    const usuarioIdLogado = localStorage.getItem('saas_user_id') || 1;
    
    try {
      const resposta = await this.api.put(`/tarefas/${tarefa.id}`, {
        descricao: novoTexto,
        concluida: tarefa.concluida ? 1 : 0,
        atualizado_por: usuarioIdLogado
      });
      
      if (resposta.ok) {
        this.limparTimerInatividade(li);
        tarefa.descricao = novoTexto;
        this.renderizarCardPadrao(li, tarefa);
        await this.atualizarContadorEBarraProgresso();
      }
    } catch (erro) {
      console.error("Falha ao processar edição inline:", erro);
    }
  }
