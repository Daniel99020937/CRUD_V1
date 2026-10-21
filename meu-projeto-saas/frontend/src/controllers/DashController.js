class DashController {
  constructor(apiService) {
    this.api = apiService;
    
    // Mapeamento de nós do DOM
    this.formTarefa = document.getElementById('form-tarefa');
    this.inputTarefa = document.getElementById('input-tarefa');
    this.listaTarefas = document.getElementById('lista-tarefas');
    this.inputBusca = document.getElementById('input-busca');
    this.selectLimite = document.getElementById('select-limite');
    this.numerosPaginasContainer = document.getElementById('numeros-paginas-container');
    this.textoContador = document.getElementById('texto-contador');
    this.fillBarraProgresso = document.getElementById('fill-barra-progresso');

    // Estados internos da instância de controle
    this.paginaAtual = 1;
    this.filtroStatusAtivo = 'todas';
    this.termoBuscaGlobal = '';
    this.limitePorPagina = 5;

    this.TIMER_DELETAR = 5000;
    this.TIMER_EDITAR = 12000;

    // Componentes de ícones SVGs
    this.ICONE_EDITAR = `<svg viewBox="0 0 24 24" class="svg-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
    this.ICONE_DELETAR = `<svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;
    this.ICONE_CONFIRMAR = `<svg viewBox="0 0 24 24" class="svg-icon"><path d="M20 6 9 17l-5-5"/></svg>`;
    this.ICONE_CANCELAR = `<svg viewBox="0 0 24 24" class="svg-icon"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  }

  inicializar() {
    this.exibirNomeTecnicoLogado();
    this.renderizarPainelCompleto();
    this.inicializarControlesAbasEPaginacao();
    this.configurarEventosGlobais();
    this.configurarMotorBuscaLocal();
    
    if (this.inputTarefa) {
      this.configurarLimpezaDeErro(this.inputTarefa);
    }
  }

  exibirNomeTecnicoLogado() {
    const nomeTecnico = localStorage.getItem('saas_user_name') || 'Técnico Especialista';
    const tagNome = document.getElementById('nome-tecnico-logado');
    if (tagNome) tagNome.innerText = nomeTecnico;
  }

  async renderizarPainelCompleto() {
    await this.listarTarefasPaginadas();
    await this.atualizarContadorEBarraProgresso();
  }

  async atualizarContadorEBarraProgresso() {
    try {
      const dados = await this.api.get('/tarefas/contador');
      if (this.textoContador) this.textoContador.innerText = `${dados.concluidas} de ${dados.total} concluídas`;
      if (this.fillBarraProgresso) {
        const porcentagem = dados.total > 0 ? (dados.concluidas / dados.total) * 100 : 0;
        this.fillBarraProgresso.style.width = `${porcentagem}%`;
      }
    } catch (erro) {
      console.error("Erro na leitura de contadores:", erro);
    }
  }
}
// Métodos de sincronização diferencial com o banco (Cole abaixo do Módulo 1)
Object.assign(DashController.prototype, {
   async listarTarefasPaginadas() {
    const endpoint = `/tarefas?page=${this.paginaAtual}&limit=${this.limitePorPagina}&status=${this.filtroStatusAtivo}&search=${encodeURIComponent(this.termoBuscaGlobal)}`;
    try {
      const dados = await this.api.get(endpoint);
      if (!this.listaTarefas) return;

      const cardsAtuaisNoDOM = Array.from(this.listaTarefas.querySelectorAll('.todo-item-wrapper'));

      // CENÁRIO 1: Se a tela estiver vazia, renderiza na ordem exata decrescente do back-end
      if (cardsAtuaisNoDOM.length === 0) {
        if (dados.tarefas && dados.tarefas.length > 0) {
          dados.tarefas.forEach(tarefa => {
            const li = document.createElement('li');
            li.className = 'todo-item-wrapper';
            li.id = `tarefa-${tarefa.id}`;
            this.renderizarCardPadrao(li, tarefa);
            this.listaTarefas.appendChild(li); // Insere na sequência natural DESC recebida
          });
        }
      } else {
        // CENÁRIO 2: Se o operador estiver digitando uma tarefa ou editando, valida o refresh sem destruir os inputs
        const idsNovosDoBanco = dados.tarefas.map(t => t.id);
        
        // Remove da tela apenas quem sumiu fisicamente do banco de dados
        cardsAtuaisNoDOM.forEach(item => {
          const idItem = parseInt(item.id.replace('tarefa-', ''));
          if (!idsNovosDoBanco.includes(idItem)) {
            item.remove();
          }
        });

        // CORREÇÃO: Varre o array invertido do banco de dados para garantir que a inserção no topo (insertBefore) mantenha a ordenação linear correta
        const tarefasInvertidas = [...dados.tarefas].reverse();
        
        tarefasInvertidas.forEach(tarefa => {
          const jaExisteNaTela = document.getElementById(`tarefa-${tarefa.id}`);
          if (!jaExisteNaTela) {
            const li = document.createElement('li');
            li.className = 'todo-item-wrapper';
            li.id = `tarefa-${tarefa.id}`;
            this.renderizarCardPadrao(li, tarefa);
            
            // Força a entrada estrita na primeira linha do painel de operações
            if (this.listaTarefas.firstChild) {
              this.listaTarefas.insertBefore(li, this.listaTarefas.firstChild);
            } else {
              this.listaTarefas.appendChild(li);
            }
          }
        });
      }
      
      this.construirBlocosNumericosPaginacao(dados.paginacao.paginaAtual, dados.paginacao.totalPaginas);
      
      const btnAnt = document.getElementById('btn-pag-anterior');
      const btnProx = document.getElementById('btn-pag-proxima');
      if (btnAnt) btnAnt.disabled = this.paginaAtual <= 1;
      if (btnProx) btnProx.disabled = this.paginaAtual >= dados.paginacao.totalPaginas;
    } catch (erro) {
      console.error("Falha ao sincronizar dados da listagem SaaS:", erro);
    }
  },


  construirBlocosNumericosPaginacao(atual, total) {
    if (!this.numerosPaginasContainer) return;
    this.numerosPaginasContainer.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= atual - 1 && i <= atual + 1)) {
        const btn = document.createElement('button');
        btn.className = `btn-pagina-numero ${i === atual ? 'ativa' : ''}`;
        btn.innerText = i;
        btn.addEventListener('click', () => { 
          this.paginaAtual = i; 
          this.renderizarPainelCompleto(); 
        });
        this.numerosPaginasContainer.appendChild(btn);
      }
    }
  },

   formatarGDH(stringData) {
    if (!stringData) return null;
    
    // Tratamento seguro para converter strings e carregar o fuso horário local corretamente
    const d = new Date(stringData);
    if (isNaN(d.getTime())) return null;
    
    const pad = (n) => String(n).padStart(2, '0');
    
    const dia = pad(d.getDate());
    const hora = pad(d.getHours());
    const minuto = pad(d.getMinutes());
    
    // Lista de meses abreviados para a auditoria SaaS corporativa
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const mes = meses[d.getMonth()];
    const ano = String(d.getFullYear()).slice(-2); // Filtra os dois últimos números (ex: 26)
    
    // RETORNO FORMATADO E ESPAÇADO: Bloqueia qualquer encavalamento dos números
    return `${dia} ${mes} ${ano} às ${hora}:${minuto}`;
  },
  
  inicializarControlesAbasEPaginacao() {
    const btnAnt = document.getElementById('btn-pag-anterior');
    if (btnAnt) {
      btnAnt.addEventListener('click', () => {
        if (this.paginaAtual > 1) {
          this.paginaAtual--;
          this.renderizarPainelCompleto();
        }
      });
    }

    const btnProx = document.getElementById('btn-pag-proxima');
    if (btnProx) {
      btnProx.addEventListener('click', () => {
        this.paginaAtual++;
        this.renderizarPainelCompleto();
      });
    }
  }
});
// Manipulação de formulários, mutações inline e inicializador (Cole abaixo do Módulo 2)
Object.assign(DashController.prototype, {
  renderizarCardPadrao(li, tarefa) {
    this.limparTimerInatividade(li);
    const id = tarefa.id;
    const checkStatusClass = tarefa.concluida ? 'checked' : '';
    const isCheckedAttr = tarefa.concluida ? 'checked' : '';
    
    let stringAuditoria = `Início: ${this.formatarGDH(tarefa.criado_em) || 'N/A'} por <span class="tecnico-tag">${tarefa.criador_nome || 'Admin'}</span>`;
    if (tarefa.concluida && tarefa.concluido_em) {
      stringAuditoria += ` | Fim: ${this.formatarGDH(tarefa.concluido_em)}`;
    }

    li.innerHTML = `
      <div class="todo-content-front ${checkStatusClass}" data-id="${id}">
        <div class="custom-checkbox-wrapper">
          <input type="checkbox" id="check-${id}" class="checkbox-input-oculto" ${isCheckedAttr}>
          <label for="check-${id}" class="custom-checkbox-visual"></label>
        </div>
        <div class="container-texto-meta">
          <span class="texto-tarefa">${tarefa.descricao}</span>
          <span class="meta-auditoria">${stringAuditoria}</span>
        </div>
        <div class="botoes-acao-fixos">
          <button class="edit-btn-fixo" title="Editar">${this.ICONE_EDITAR}</button>
          <button class="delete-btn-fixo" title="Deletar">${this.ICONE_DELETAR}</button>
        </div>
      </div>
    `;

    li.querySelector(`#check-${id}`).addEventListener('change', async (e) => {
      const novoEstado = e.target.checked ? 1 : 0;
      const usuarioIdLogado = localStorage.getItem('saas_user_id') || 1;
      
      await this.api.put(`/tarefas/${id}`, {
        descricao: tarefa.descricao,
        concluida: novoEstado,
        atualizado_por: usuarioIdLogado
      });
      this.renderizarPainelCompleto();
    });

    li.querySelector('.edit-btn-fixo').addEventListener('click', () => { this.habilitarEdicaoInline(li, tarefa); });
    li.querySelector('.delete-btn-fixo').addEventListener('click', () => { this.solicitarConfirmacaoDelecao(li, tarefa); });
  },

  configurarEventosGlobais() {
    const btnLogout = document.getElementById('btn-logout-saas');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        authController.executarLogout();
      });
    }

    if (this.formTarefa) {
      this.formTarefa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { val, inputValido } = this.obterEValidarTexto(this.inputTarefa);
        if (!inputValido) return;

        const usuarioIdLogado = localStorage.getItem('saas_user_id') || 1;
        try {
          const resposta = await this.api.post('/tarefas', { descricao: val, usuario_id: usuarioIdLogado });
          
          if (!resposta.ok) {
            const dadosErro = await resposta.json();
            this.mostrarErroNoInput(this.inputTarefa, dadosErro.error || "Erro ao salvar tarefa.");
            return;
          }
          
          const novaTarefaCriada = await resposta.json();
          this.inputTarefa.value = '';
          
          // Se o usuário estiver na página 1, renderiza o item criado no topo dinamicamente sem quebrar as edições abertas
          if (this.paginaAtual === 1) {
            const li = document.createElement('li');
            li.className = 'todo-item-wrapper';
            li.id = `tarefa-${novaTarefaCriada.id}`;
            this.renderizarCardPadrao(li, novaTarefaCriada);
            
            if (this.listaTarefas.firstChild) {
              this.listaTarefas.insertBefore(li, this.listaTarefas.firstChild);
            } else {
              this.listaTarefas.appendChild(li);
            }
          }

          // Sincroniza a paginação e a barra de carregamento sem destruir os inputs paralelos
          await this.listarTarefasPaginadas();
          await this.atualizarContadorEBarraProgresso();
          
        } catch (erro) {
          console.error("Falha ao registrar tarefa:", erro);
        }
      });
    }

    if (this.selectLimite) {
      this.selectLimite.addEventListener('change', (e) => {
        this.limitePorPagina = parseInt(e.target.value) || 5;
        this.paginaAtual = 1;
        this.renderizarPainelCompleto();
      });
    }

    document.querySelectorAll('.aba-btn').forEach(botao => {
      botao.addEventListener('click', (e) => {
        document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
        e.target.classList.add('ativa');
        this.filtroStatusAtivo = e.target.dataset.status;
        this.paginaAtual = 1;
        this.renderizarPainelCompleto();
      });
    });
  },


  habilitarEdicaoInline(li, tarefa) {
    this.limparTimerInatividade(li);
    const id = tarefa.id;
    li.innerHTML = `
      <div class="todo-content-front em-edicao">
        <div class="container-input-validacao">
          <input type="text" class="input-edicao" value="${tarefa.descricao}" id="input-edit-${id}">
        </div>
        <div class="botoes-edicao-rapida">
          <button class="btn-salvar-inline" title="Salvar">${this.ICONE_CONFIRMAR}</button>
          <button class="btn-cancelar-inline" title="Cancelar">${this.ICONE_CANCELAR}</button>
        </div>
        <div class="barra-progresso-timeout linear-edit"></div>
      </div>
    `;
    const input = document.getElementById(`input-edit-${id}`);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    this.configurarLimpezaDeErro(input);

    const reiniciarTimerEdicao = () => {
      this.limparTimerInatividade(li);
      const barra = li.querySelector('.barra-progresso-timeout');
      if (barra) {
        barra.style.animation = 'none';
        barra.offsetHeight;
        barra.style.animation = `decrementarBarra ${this.TIMER_EDITAR}ms linear forwards`;
      }
      li.timerInatividade = setTimeout(() => { this.renderizarCardPadrao(li, tarefa); }, this.TIMER_EDITAR);
    };

    reiniciarTimerEdicao();
    input.addEventListener('input', reiniciarTimerEdicao);

    li.querySelector('.btn-salvar-inline').addEventListener('click', () => this.salvarEdicaoInline(li, tarefa));
    li.querySelector('.btn-cancelar-inline').addEventListener('click', () => this.renderizarCardPadrao(li, tarefa));
  },

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
  },

  solicitarConfirmacaoDelecao(li, tarefa) {
    this.limparTimerInatividade(li);
    li.innerHTML = `
      <div class="todo-content-front em-deletar">
        <span class="aviso-excluir">Excluir tarefa?</span>
        <div class="botoes-edicao-rapida">
          <button class="btn-confirmar-delete" title="Confirmar">${this.ICONE_CONFIRMAR}</button>
          <button class="btn-cancelar-inline" title="Voltar">${this.ICONE_CANCELAR}</button>
        </div>
        <div class="barra-progresso-timeout linear-delete"></div>
      </div>
    `;
    const barra = li.querySelector('.barra-progresso-timeout');
    if (barra) barra.style.animation = `decrementarBarra ${this.TIMER_DELETAR}ms linear forwards`;

    li.querySelector('.btn-confirmar-delete').addEventListener('click', async () => {
      this.limparTimerInatividade(li);
      try {
        await this.api.delete(`/tarefas/${tarefa.id}`);
        
        li.classList.add('removendo-tarefa');
        setTimeout(async () => {
          li.remove();
          const totalCardsRestantes = this.listaTarefas.querySelectorAll('.todo-item-wrapper').length;
          if (totalCardsRestantes === 0 && this.paginaAtual > 1) {
            this.paginaAtual--;
          }
          await this.listarTarefasPaginadas();
        }, 250);

        await this.atualizarContadorEBarraProgresso();
      } catch (erro) {
        console.error("Erro ao deletar item isolado da sprint:", erro);
      }
    });

    li.querySelector('.btn-cancelar-inline').addEventListener('click', () => this.renderizarCardPadrao(li, tarefa));
    li.timerInatividade = setTimeout(() => { this.renderizarCardPadrao(li, tarefa); }, this.TIMER_DELETAR);
  },

  configurarMotorBuscaLocal() {
    if (!this.inputBusca) return;
    this.inputBusca.addEventListener('input', (e) => { 
      this.termoBuscaGlobal = e.target.value; 
      this.paginaAtual = 1; 
      this.renderizarPainelCompleto(); 
    });
  },

  configurarLimpezaDeErro(inputElement) {
    inputElement.addEventListener('input', () => {
      const err = inputElement.parentElement.querySelector('.balao-erro');
      if (err) err.remove();
      inputElement.classList.remove('borda-erro-fixa');
    });
  },

  mostrarErroNoInput(inputElement, msg) {
    const container = inputElement.parentElement;
    const err = container.querySelector('.balao-erro');
    if (err) err.remove();
    inputElement.classList.add('borda-erro-fixa');
    const balao = document.createElement('div');
    balao.className = 'balao-erro'; 
    balao.innerText = msg;
    container.appendChild(balao);
  },

  obterEValidarTexto(inputElement) {
    const val = inputElement.value.trim();
    if (val === '') {
      this.mostrarErroNoInput(inputElement, 'Preencha este campo.');
      return { val: '', inputValido: false };
    }
    return { val, inputValido: true };
  },

  limparTimerInatividade(li) {
    if (li.timerInatividade) { clearTimeout(li.timerInatividade); li.timerInatividade = null; }
  }
});

// Inicialização automática acoplada ao window
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('lista-tarefas')) {
    const dashController = new DashController(apiService);
    dashController.inicializar();
  }
});
