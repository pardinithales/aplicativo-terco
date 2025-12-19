class PastoralManager {
    constructor() {
        this.grupoAtual = localStorage.getItem('grupoAtual') || null;
        this.currentMonth = new Date();
        
        if (this.grupoAtual) {
            this.loadGrupoData();
            this.showApp();
        } else {
            this.showGrupoSelector();
        }
    }

    loadGrupoData() {
        const prefix = `grupo_${this.grupoAtual}_`;
        this.casaisPastoral = this.loadData(prefix + 'casaisPastoral') || [];
        this.familiasSorteadas = this.loadData(prefix + 'familiasSorteadas') || [];
        this.escala = this.loadData(prefix + 'escala') || [];
        this.tercos = this.loadData(prefix + 'tercos') || [];
    }

    showGrupoSelector() {
        document.getElementById('grupoSelector').style.display = 'block';
        document.getElementById('grupoAtual').style.display = 'none';
        document.querySelector('.tabs').style.display = 'none';
        document.querySelector('main').style.display = 'none';
        document.querySelector('footer').style.display = 'none';

        document.querySelectorAll('.grupo-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selecionarGrupo(card.dataset.grupo);
            });
        });
    }

    selecionarGrupo(grupo) {
        this.grupoAtual = grupo;
        localStorage.setItem('grupoAtual', grupo);
        this.loadGrupoData();
        this.carregarExemplosGrupo();
        this.showApp();
    }

    showApp() {
        document.getElementById('grupoSelector').style.display = 'none';
        document.getElementById('grupoAtual').style.display = 'flex';
        document.querySelector('.tabs').style.display = 'flex';
        document.querySelector('main').style.display = 'block';
        document.querySelector('footer').style.display = 'block';

        const nomes = {
            'sabado-19h30': '🕯️ Sábado 19h30',
            'domingo-7h30': '🌅 Domingo 7h30',
            'domingo-9h30': '☀️ Domingo 9h30',
            'domingo-17h-capela': '⛪ Domingo 17h Capela',
            'domingo-19h': '🌙 Domingo 19h'
        };

        document.getElementById('grupoNome').textContent = nomes[this.grupoAtual] || this.grupoAtual;
        
        document.getElementById('trocarGrupo').onclick = () => {
            if (confirm('Deseja trocar de grupo? Os dados do grupo atual serão salvos.')) {
                this.showGrupoSelector();
            }
        };

        this.init();
        this.setupAutoBackup();
        this.verificarBackupPendente();
    }

    init() {
        this.setupTabs();
        this.bindEvents();
        this.render();
    }

    carregarExemplosGrupo() {
        if (this.casaisPastoral.length === 0) {
            const dadosGrupos = this.getDadosGrupo();
            this.casaisPastoral = dadosGrupos.casais;
            this.saveData('casaisPastoral', this.casaisPastoral);
        }
    }

    getDadosGrupo() {
        const grupos = {
            'sabado-19h30': {
                casais: [
                    { id: 1, nome1: 'Ana Letícia', telefone1: '17 99000-0001', nome2: 'Alexandre', telefone2: '17 99000-0002', cadastroEm: '2025-12-19T10:00:00' },
                    { id: 2, nome1: 'Adriana', telefone1: '17 99000-0003', nome2: 'Claudio', telefone2: '17 99000-0004', cadastroEm: '2025-12-19T10:05:00' },
                    { id: 3, nome1: 'Regina', telefone1: '17 99000-0005', nome2: 'Inério', telefone2: '17 99000-0006', cadastroEm: '2025-12-19T10:10:00' },
                    { id: 4, nome1: 'Bárbara', telefone1: '17 99000-0007', nome2: 'Aroldo', telefone2: '17 99000-0008', cadastroEm: '2025-12-19T10:15:00' },
                    { id: 5, nome1: 'Edna', telefone1: '17 99000-0009', nome2: 'Celso', telefone2: '17 99000-0010', cadastroEm: '2025-12-19T10:20:00' }
                ]
            },
            'domingo-7h30': {
                casais: [
                    { id: 1, nome1: 'Cleusa', telefone1: '17 99000-0011', nome2: 'Edson', telefone2: '17 99000-0012', cadastroEm: '2025-12-19T10:00:00' },
                    { id: 2, nome1: 'Regina', telefone1: '17 99000-0013', nome2: 'Nivaldo', telefone2: '17 99000-0014', cadastroEm: '2025-12-19T10:05:00' },
                    { id: 3, nome1: 'Simone', telefone1: '17 99000-0015', nome2: 'Antônio', telefone2: '17 99000-0016', cadastroEm: '2025-12-19T10:10:00' }
                ]
            },
            'domingo-9h30': {
                casais: [
                    { id: 1, nome1: 'Ana Eliza', telefone1: '17 99000-0021', nome2: 'William', telefone2: '17 99000-0022', cadastroEm: '2025-12-19T10:00:00' },
                    { id: 2, nome1: 'Ana Bazo', telefone1: '17 99000-0023', nome2: 'Neto', telefone2: '17 99000-0024', cadastroEm: '2025-12-19T10:05:00' },
                    { id: 3, nome1: 'Carol', telefone1: '17 99000-0025', nome2: 'Serginho', telefone2: '17 99000-0026', cadastroEm: '2025-12-19T10:10:00' },
                    { id: 4, nome1: 'Cintia', telefone1: '17 99000-0027', nome2: 'Rafael', telefone2: '17 99000-0028', cadastroEm: '2025-12-19T10:15:00' },
                    { id: 5, nome1: 'Edna', telefone1: '17 99000-0029', nome2: 'Celso', telefone2: '17 99000-0030', cadastroEm: '2025-12-19T10:20:00' },
                    { id: 6, nome1: 'Larissa', telefone1: '17 99000-0031', nome2: 'Sylvio', telefone2: '17 99000-0032', cadastroEm: '2025-12-19T10:25:00' },
                    { id: 7, nome1: 'Sônia', telefone1: '17 99000-0033', nome2: 'Renato', telefone2: '17 99000-0034', cadastroEm: '2025-12-19T10:30:00' }
                ]
            },
            'domingo-17h-capela': {
                casais: [
                    { id: 1, nome1: 'Madá', telefone1: '17 99000-0041', nome2: 'Carlão', telefone2: '17 99000-0042', cadastroEm: '2025-12-19T10:00:00' },
                    { id: 2, nome1: 'Camila', telefone1: '17 99000-0043', nome2: 'Joelmir', telefone2: '17 99000-0044', cadastroEm: '2025-12-19T10:05:00' }
                ]
            },
            'domingo-19h': {
                casais: [
                    { id: 1, nome1: 'Adriana', telefone1: '17 98194-0354', nome2: 'Beto', telefone2: '17 98194-0355', cadastroEm: '2025-11-26T10:00:00' },
                    { id: 2, nome1: 'Célia', telefone1: '17 99783-4825', nome2: 'Marcelo', telefone2: '17 99783-4826', cadastroEm: '2025-11-26T10:05:00' },
                    { id: 3, nome1: 'Julia', telefone1: '17 99000-0001', nome2: 'Thales', telefone2: '17 99000-0002', cadastroEm: '2025-11-26T10:10:00' },
                    { id: 4, nome1: 'Priscila', telefone1: '17 99103-7138', nome2: 'Marcelo', telefone2: '17 99103-7139', cadastroEm: '2025-11-26T10:15:00' },
                    { id: 5, nome1: 'Vanda', telefone1: '17 99155-6458', nome2: 'Carlinhos', telefone2: '17 99155-6459', cadastroEm: '2025-11-26T10:20:00' }
                ]
            }
        };

        return grupos[this.grupoAtual] || { casais: [] };
    }


    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(`tab-${e.target.dataset.tab}`).classList.add('active');
                this.render();
            });
        });
    }

    bindEvents() {
        document.getElementById('addCasalPastoralBtn').addEventListener('click', () => this.showCasalPastoralModal());
        document.getElementById('addFamiliaBtn').addEventListener('click', () => this.showFamiliaModal());
        document.getElementById('escalaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEscala();
        });
        document.getElementById('addTercoBtn').addEventListener('click', () => this.showTercoModal());
        
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
            localStorage.setItem(`ultimoBackup_${this.grupoAtual}`, new Date().toISOString());
        });
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('adminBtn').addEventListener('click', () => {
            document.getElementById('adminModal').style.display = 'block';
        });
        
        document.getElementById('closeAdmin').addEventListener('click', () => {
            document.getElementById('adminModal').style.display = 'none';
            this.logoutAdmin();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginAdmin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logoutAdmin();
            document.getElementById('adminModal').style.display = 'none';
        });

        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.closeModal();
        });
    }

    renderDashboard() {
        const hoje = new Date();
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        
        document.getElementById('totalCasaisPastoral').textContent = this.casaisPastoral.length;
        document.getElementById('totalFamilias').textContent = this.familiasSorteadas.length;
        
        const tercosMes = this.tercos.filter(t => t.data.startsWith(mesAtual));
        document.getElementById('tercosMes').textContent = tercosMes.length;
        
        const familiasAguardando = this.familiasSorteadas.filter(f => {
            return !this.tercos.some(t => t.familiaId === f.id);
        });
        document.getElementById('proximoSorteio').textContent = familiasAguardando.length;
        document.getElementById('diasParaSorteio').textContent = 'aguardando terço';
        
        document.getElementById('dashMesAtual').textContent = this.formatMonth(mesAtual);
        
        const responsible = this.escala.find(e => e.month === mesAtual);
        const dashResponsavel = document.getElementById('dashResponsavel');
        if (responsible) {
            const casal = this.casaisPastoral.find(c => c.id === responsible.casalId);
            dashResponsavel.innerHTML = `<p><strong>👥 ${casal.nome1} e ${casal.nome2}</strong><br>📞 ${casal.telefone1} / ${casal.telefone2}</p>`;
        } else {
            dashResponsavel.innerHTML = '<p class="alert-warning">⚠️ Nenhum responsável definido para este mês</p>';
        }
        
        const proximosTercos = this.tercos
            .filter(t => new Date(t.data) >= hoje)
            .sort((a, b) => a.data.localeCompare(b.data))
            .slice(0, 3);
        
        const dashProximosTercos = document.getElementById('dashProximosTercos');
        if (proximosTercos.length === 0) {
            dashProximosTercos.innerHTML = '<p class="empty-state">Nenhum terço agendado</p>';
        } else {
            dashProximosTercos.innerHTML = proximosTercos.map(terco => {
                const familia = this.familiasSorteadas.find(f => f.id === terco.familiaId);
                const confirmados = terco.confirmacoes?.length || 0;
                const total = terco.casaisIds.length;
                return `
                    <div class="dashboard-terco">
                        <div class="terco-date">${this.formatDateShort(new Date(terco.data))}</div>
                        <div class="terco-info-dash">
                            <strong>${familia?.nome || 'Família não encontrada'}</strong>
                            <p>🕐 ${terco.hora} • ${terco.padre}</p>
                            <p>📍 ${familia?.endereco || ''}</p>
                            ${total > 0 ? `<span class="badge">${confirmados}/${total} confirmados</span>` : '<span class="badge-warning">Sem casais definidos</span>'}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        this.renderCalendario();
    }

    renderCalendario() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        
        const primeiroDia = new Date(ano, mes, 1).getDay();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();
        
        const calendario = document.getElementById('calendario');
        let html = '<div class="calendario-header">';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dia => {
            html += `<div class="dia-semana">${dia}</div>`;
        });
        html += '</div><div class="calendario-dias">';
        
        for (let i = 0; i < primeiroDia; i++) {
            html += '<div class="dia-vazio"></div>';
        }
        
        const mesAtual = `${ano}-${String(mes + 1).padStart(2, '0')}`;
        for (let dia = 1; dia <= ultimoDia; dia++) {
            const dataStr = `${mesAtual}-${String(dia).padStart(2, '0')}`;
            const terco = this.tercos.find(t => t.data === dataStr);
            const isHoje = dia === hoje.getDate();
            
            let classes = 'dia';
            if (isHoje) classes += ' hoje';
            if (terco) classes += ' tem-terco';
            
            html += `<div class="${classes}">
                <span class="dia-numero">${dia}</span>
                ${terco ? '<span class="terco-indicator">✝️</span>' : ''}
            </div>`;
        }
        
        html += '</div>';
        calendario.innerHTML = html;
    }

    showCasalPastoralModal(casal = null) {
        const isEdit = !!casal;
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h2>${isEdit ? 'Editar' : 'Adicionar'} Casal da Pastoral</h2>
            <form id="casalForm">
                <input type="text" id="casalNome1" placeholder="Nome (pessoa 1)" value="${casal?.nome1 || ''}" required>
                <input type="tel" id="casalTelefone1" placeholder="Telefone pessoa 1 (17 99123-4567)" value="${casal?.telefone1 || ''}" required>
                <input type="text" id="casalNome2" placeholder="Nome (pessoa 2)" value="${casal?.nome2 || ''}" required>
                <input type="tel" id="casalTelefone2" placeholder="Telefone pessoa 2 (17 99123-4567)" value="${casal?.telefone2 || ''}" required>
                <button type="submit">${isEdit ? 'Salvar' : 'Adicionar'}</button>
            </form>
        `;

        document.getElementById('modal').style.display = 'block';
        
        document.getElementById('casalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const casalData = {
                id: casal?.id || Date.now(),
                nome1: document.getElementById('casalNome1').value.trim(),
                telefone1: document.getElementById('casalTelefone1').value.trim(),
                nome2: document.getElementById('casalNome2').value.trim(),
                telefone2: document.getElementById('casalTelefone2').value.trim(),
                cadastroEm: casal?.cadastroEm || new Date().toISOString()
            };

            if (isEdit) {
                const index = this.casaisPastoral.findIndex(c => c.id === casal.id);
                this.casaisPastoral[index] = casalData;
            } else {
                this.casaisPastoral.push(casalData);
            }

            this.saveData('casaisPastoral', this.casaisPastoral);
            this.closeModal();
            this.render();
        });
    }

    deleteCasalPastoral(id) {
        if (confirm('Excluir este casal da pastoral?')) {
            this.casaisPastoral = this.casaisPastoral.filter(c => c.id !== id);
            this.saveData('casaisPastoral', this.casaisPastoral);
            this.render();
        }
    }

    showFamiliaModal(familia = null) {
        const isEdit = !!familia;
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h2>${isEdit ? 'Editar' : 'Cadastro Rápido'} - Família Sorteada</h2>
            <form id="familiaForm" class="quick-form">
                <input type="text" id="familiaNome1" placeholder="Nome pessoa 1" value="${familia?.nome1 || ''}" required autofocus>
                <input type="tel" id="familiaTelefone1" placeholder="Telefone 1 (17 99123-4567)" value="${familia?.telefone1 || ''}" required>
                
                <input type="text" id="familiaNome2" placeholder="Nome pessoa 2" value="${familia?.nome2 || ''}" required>
                <input type="tel" id="familiaTelefone2" placeholder="Telefone 2 (17 99123-4567)" value="${familia?.telefone2 || ''}" required>
                
                <input type="text" id="familiaEndereco" placeholder="Endereço (Rua, número)" value="${familia?.endereco || ''}" required>
                
                <input type="date" id="familiaSorteio" value="${familia?.dataSorteio ? familia.dataSorteio.split('T')[0] : new Date().toISOString().split('T')[0]}" required>
                
                <textarea id="familiaObs" placeholder="Observações (opcional)" rows="2">${familia?.observacoes || ''}</textarea>
                
                <button type="submit" class="btn-large">${isEdit ? '✅ Salvar' : '➕ Cadastrar'}</button>
            </form>
        `;

        document.getElementById('modal').style.display = 'block';
        
        document.getElementById('familiaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const familiaData = {
                id: familia?.id || Date.now(),
                nome1: document.getElementById('familiaNome1').value.trim(),
                telefone1: document.getElementById('familiaTelefone1').value.trim(),
                nome2: document.getElementById('familiaNome2').value.trim(),
                telefone2: document.getElementById('familiaTelefone2').value.trim(),
                endereco: document.getElementById('familiaEndereco').value.trim(),
                observacoes: document.getElementById('familiaObs').value.trim(),
                dataSorteio: document.getElementById('familiaSorteio').value + 'T19:00:00',
                cadastroEm: familia?.cadastroEm || new Date().toISOString()
            };

            if (isEdit) {
                const index = this.familiasSorteadas.findIndex(f => f.id === familia.id);
                this.familiasSorteadas[index] = familiaData;
            } else {
                this.familiasSorteadas.push(familiaData);
            }

            this.saveData('familiasSorteadas', this.familiasSorteadas);
            this.closeModal();
            this.render();
        });
    }

    deleteFamilia(id) {
        if (confirm('Excluir esta família?')) {
            this.familiasSorteadas = this.familiasSorteadas.filter(f => f.id !== id);
            this.saveData('familiasSorteadas', this.familiasSorteadas);
            this.render();
        }
    }

    renderCasaisPastoral() {
        const list = document.getElementById('casaisPastoralList');
        
        if (this.casaisPastoral.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhum casal cadastrado</p>';
            return;
        }

        list.innerHTML = this.casaisPastoral.map(casal => `
            <div class="card">
                <div class="card-header">
                    <h3>👥 ${casal.nome1} e ${casal.nome2}</h3>
                </div>
                <p>📞 ${casal.telefone1}<br>📞 ${casal.telefone2}</p>
                <p class="data-cadastro">📅 Cadastrado em ${this.formatDateTime(casal.cadastroEm)}</p>
                <div class="card-actions">
                    <button onclick="app.showCasalPastoralModal(${JSON.stringify(casal).replace(/"/g, '&quot;')})" class="btn-edit">✏️ Editar</button>
                    <button onclick="app.deleteCasalPastoral(${casal.id})" class="btn-delete">🗑️ Excluir</button>
                </div>
            </div>
        `).join('');
    }

    renderFamilias() {
        document.getElementById('proximoSorteioInfo').textContent = '2º domingo do mês na Igreja';
        
        const list = document.getElementById('familiaslist');
        
        if (this.familiasSorteadas.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma família cadastrada</p>';
            return;
        }

        list.innerHTML = this.familiasSorteadas.map(familia => `
            <div class="card">
                <div class="card-header">
                    <h3>🏠 ${familia.nome}</h3>
                    <span class="badge-sorteio">🎲 Sorteado em ${this.formatDateShort(new Date(familia.dataSorteio))}</span>
                </div>
                <p>📞 ${familia.telefone1}<br>📞 ${familia.telefone2}</p>
                <p>🏠 ${familia.endereco}</p>
                ${familia.observacoes ? `<p class="obs">📝 ${familia.observacoes}</p>` : ''}
                <p class="data-cadastro">📅 Cadastrado em ${this.formatDateTime(familia.cadastroEm)}</p>
                <div class="card-actions">
                    <button onclick="app.showFamiliaModal(${JSON.stringify(familia).replace(/"/g, '&quot;')})" class="btn-edit">✏️ Editar</button>
                    <button onclick="app.deleteFamilia(${familia.id})" class="btn-delete">🗑️ Excluir</button>
                </div>
            </div>
        `).join('');
    }

    populateEscalaSelects() {
        const monthSelect = document.getElementById('escalaMonth');
        const casalSelect = document.getElementById('escalaCasal');

        monthSelect.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const text = this.formatMonth(value);
            monthSelect.innerHTML += `<option value="${value}">${text}</option>`;
        }

        casalSelect.innerHTML = '<option value="">Selecione o casal responsável</option>';
        this.casaisPastoral.forEach(casal => {
            casalSelect.innerHTML += `<option value="${casal.id}">${casal.nome1} e ${casal.nome2}</option>`;
        });
    }

    addEscala() {
        const month = document.getElementById('escalaMonth').value;
        const casalId = parseInt(document.getElementById('escalaCasal').value);

        if (!month || !casalId) return;

        const existingIndex = this.escala.findIndex(e => e.month === month);
        
        if (existingIndex >= 0) {
            this.escala[existingIndex].casalId = casalId;
        } else {
            this.escala.push({ month, casalId });
        }

        this.saveData('escala', this.escala);
        this.render();
    }

    deleteEscala(month) {
        if (confirm('Remover responsável deste mês?')) {
            this.escala = this.escala.filter(e => e.month !== month);
            this.saveData('escala', this.escala);
            this.render();
        }
    }

    renderEscala() {
        this.populateEscalaSelects();
        
        const list = document.getElementById('escalaList');
        
        if (this.escala.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma escala definida</p>';
            return;
        }

        const sortedEscala = [...this.escala].sort((a, b) => a.month.localeCompare(b.month));

        list.innerHTML = sortedEscala.map(e => {
            const casal = this.casaisPastoral.find(c => c.id === e.casalId);
            return `
                <div class="card">
                    <h3>📅 ${this.formatMonth(e.month)}</h3>
                    <p>👥 ${casal ? `${casal.nome1} e ${casal.nome2}` : 'Casal não encontrado'}</p>
                    <button onclick="app.deleteEscala('${e.month}')" class="btn-delete">🗑️ Remover</button>
                </div>
            `;
        }).join('');
    }

    changeMonth(delta) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + delta);
        this.render();
    }

    getCurrentMonthKey() {
        return `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;
    }

    showTercoModal(terco = null) {
        const isEdit = !!terco;
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h2>${isEdit ? 'Editar' : 'Adicionar'} Terço</h2>
            <form id="tercoForm">
                <h3>📅 Data e Horário</h3>
                <input type="date" id="tercoData" value="${terco?.data || ''}" required>
                <input type="time" id="tercoHora" value="${terco?.hora || '20:15'}" required>
                
                <h3>✝️ Padre</h3>
                <input type="text" id="tercoPadre" placeholder="Pe. Costante, Pe. Zé..." value="${terco?.padre || ''}" required>

                <h3>🏠 Família</h3>
                <select id="tercoFamilia" required>
                    <option value="">Selecione a família</option>
                    ${this.familiasSorteadas.map(f => `
                        <option value="${f.id}" ${terco?.familiaId === f.id ? 'selected' : ''}>
                            ${f.nome} - ${f.endereco}
                        </option>
                    `).join('')}
                </select>

                <h3>👥 Casais da Pastoral</h3>
                <div id="casaisCheckbox">
                    ${this.casaisPastoral.map(c => `
                        <label>
                            <input type="checkbox" value="${c.id}" ${terco?.casaisIds?.includes(c.id) ? 'checked' : ''}>
                            ${c.nome1} e ${c.nome2}
                        </label>
                    `).join('')}
                </div>

                <h3>📝 Observações</h3>
                <textarea id="tercoObs" placeholder="Ex: casa pequena, insegura com chuva">${terco?.observacoes || ''}</textarea>
                
                <button type="submit">${isEdit ? 'Salvar' : 'Adicionar'}</button>
            </form>
        `;

        document.getElementById('modal').style.display = 'block';
        
        document.getElementById('tercoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const casaisIds = Array.from(document.querySelectorAll('#casaisCheckbox input:checked'))
                .map(cb => parseInt(cb.value));

            const tercoData = {
                id: terco?.id || Date.now(),
                data: document.getElementById('tercoData').value,
                hora: document.getElementById('tercoHora').value,
                padre: document.getElementById('tercoPadre').value.trim(),
                familiaId: parseInt(document.getElementById('tercoFamilia').value),
                casaisIds,
                observacoes: document.getElementById('tercoObs').value.trim(),
                confirmacoes: terco?.confirmacoes || [],
                cadastroEm: terco?.cadastroEm || new Date().toISOString()
            };

            if (isEdit) {
                const index = this.tercos.findIndex(t => t.id === terco.id);
                this.tercos[index] = tercoData;
            } else {
                this.tercos.push(tercoData);
            }

            this.saveData('tercos', this.tercos);
            this.closeModal();
            this.render();
        });
    }

    deleteTerco(id) {
        if (confirm('Excluir este terço?')) {
            this.tercos = this.tercos.filter(t => t.id !== id);
            this.saveData('tercos', this.tercos);
            this.render();
        }
    }

    toggleConfirmacao(tercoId, casalId) {
        const terco = this.tercos.find(t => t.id === tercoId);
        if (!terco) return;

        if (!terco.confirmacoes) terco.confirmacoes = [];

        const index = terco.confirmacoes.findIndex(c => c.casalId === casalId);
        
        if (index >= 0) {
            terco.confirmacoes.splice(index, 1);
        } else {
            terco.confirmacoes.push({ casalId, confirmedAt: new Date().toISOString() });
        }

        this.saveData('tercos', this.tercos);
        this.render();
    }

    copiarWhatsApp(tercoId) {
        const terco = this.tercos.find(t => t.id === tercoId);
        if (!terco) return;

        const familia = this.familiasSorteadas.find(f => f.id === terco.familiaId);
        const casaisParticipantes = terco.casaisIds.map(id => this.casaisPastoral.find(c => c.id === id)).filter(Boolean);
        
        const [ano, mes, dia] = terco.data.split('-');
        const dataFormatada = `${dia}/${mes}`;
        
        let mensagem = `Terço da Família\n`;
        mensagem += `Dia ${dataFormatada} - às ${terco.hora}\n`;
        mensagem += `Residência: ${familia.nome}\n`;
        mensagem += `${familia.endereco}\n`;
        mensagem += `${terco.padre}\n`;
        
        casaisParticipantes.forEach((casal, index) => {
            const confirmado = terco.confirmacoes?.some(c => c.casalId === casal.id);
            if (confirmado) {
                mensagem += `Casal ${index + 1}: ${casal.nome1}${casal.nome2 ? ' e ' + casal.nome2 : ''}\n`;
            } else {
                mensagem += `Casal ${index + 1}: ?\n`;
            }
        });

        if (terco.observacoes) {
            mensagem += `\nObs.: ${terco.observacoes}`;
        }

        navigator.clipboard.writeText(mensagem).then(() => {
            alert('✅ Mensagem copiada! Cole no WhatsApp');
        }).catch(() => {
            prompt('Copie a mensagem abaixo:', mensagem);
        });
    }

    renderTercos() {
        document.getElementById('currentMonth').textContent = this.formatMonth(this.getCurrentMonthKey());

        const monthKey = this.getCurrentMonthKey();
        const responsible = this.escala.find(e => e.month === monthKey);
        const monthResponsible = document.getElementById('monthResponsible');

        if (responsible) {
            const casal = this.casaisPastoral.find(c => c.id === responsible.casalId);
            monthResponsible.innerHTML = `📋 <strong>Responsável pela pasta:</strong> ${casal.nome1} e ${casal.nome2}`;
            monthResponsible.style.display = 'block';
        } else {
            monthResponsible.innerHTML = '⚠️ <strong>Defina o responsável pela pasta na aba "Escala Pasta"</strong>';
            monthResponsible.style.display = 'block';
        }

        const list = document.getElementById('tercosList');
        const tercosMes = this.tercos.filter(t => t.data.startsWith(monthKey));

        if (tercosMes.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhum terço agendado neste mês</p>';
            return;
        }

        list.innerHTML = tercosMes.sort((a, b) => a.data.localeCompare(b.data)).map(terco => {
            const familia = this.familiasSorteadas.find(f => f.id === terco.familiaId);
            const casaisParticipantes = terco.casaisIds.map(id => this.casaisPastoral.find(c => c.id === id)).filter(Boolean);
            
            return `
                <div class="terco-card">
                    <div class="terco-header">
                        <div>
                            <h3>✝️ ${this.formatDate(new Date(terco.data))} - ${terco.hora}</h3>
                            <p class="priest-name">${terco.padre}</p>
                        </div>
                        <button onclick="app.copiarWhatsApp(${terco.id})" class="btn-whatsapp">
                            📱 Copiar p/ WhatsApp
                        </button>
                    </div>

                    <div class="terco-section">
                        <h4>🏠 Família</h4>
                        <p><strong>${familia?.nome || 'Família não encontrada'}</strong></p>
                        <p>📞 ${familia?.telefone1 || ''}<br>📞 ${familia?.telefone2 || ''}</p>
                        <p>🏠 ${familia?.endereco || ''}</p>
                        ${familia?.observacoes ? `<p class="obs">📝 ${familia.observacoes}</p>` : ''}
                        ${familia?.dataSorteio ? `<p class="data-sorteio">🎲 Sorteado em ${this.formatDateShort(new Date(familia.dataSorteio))}</p>` : ''}
                    </div>

                    <div class="terco-section">
                        <h4>👥 Casais da Pastoral</h4>
                        ${casaisParticipantes.length === 0 ? '<p class="alert-warning">⚠️ Nenhum casal definido ainda</p>' : ''}
                        ${casaisParticipantes.map((casal, index) => {
                            const confirmado = terco.confirmacoes?.some(c => c.casalId === casal.id);
                            return `
                                <div class="casal-confirmacao">
                                    <span>Casal ${index + 1}: ${casal.nome1} e ${casal.nome2}</span>
                                    <button onclick="app.toggleConfirmacao(${terco.id}, ${casal.id})" 
                                            class="btn-confirm ${confirmado ? 'confirmed' : ''}">
                                        ${confirmado ? '✅ Confirmado' : '⭕ Confirmar'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    ${terco.observacoes ? `
                        <div class="terco-section obs-section">
                            <h4>📝 Observações</h4>
                            <p>${terco.observacoes}</p>
                        </div>
                    ` : ''}

                    <p class="data-cadastro">📅 Cadastrado em ${this.formatDateTime(terco.cadastroEm)}</p>

                    <div class="card-actions">
                        <button onclick="app.showTercoModal(${JSON.stringify(terco).replace(/"/g, '&quot;')})" class="btn-edit">✏️ Editar</button>
                        <button onclick="app.deleteTerco(${terco.id})" class="btn-delete">🗑️ Excluir</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    render() {
        this.renderDashboard();
        this.renderCasaisPastoral();
        this.renderFamilias();
        this.renderEscala();
        this.renderTercos();
    }

    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${months[parseInt(month) - 1]} ${year}`;
    }

    formatDate(date) {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    formatDateShort(date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    formatDateTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    loadData(key) {
        const fullKey = key.startsWith('grupo_') ? key : `grupo_${this.grupoAtual}_${key}`;
        const data = localStorage.getItem(fullKey);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, value) {
        const fullKey = key.startsWith('grupo_') ? key : `grupo_${this.grupoAtual}_${key}`;
        localStorage.setItem(fullKey, JSON.stringify(value));
    }

    exportData() {
        const data = {
            grupo: this.grupoAtual,
            casaisPastoral: this.casaisPastoral,
            familiasSorteadas: this.familiasSorteadas,
            escala: this.escala,
            tercos: this.tercos,
            dataExportacao: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pastoral-backup-${this.grupoAtual}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                let mensagem = 'Importar dados? Isso substituirá os dados atuais deste grupo.';
                if (data.grupo && data.grupo !== this.grupoAtual) {
                    mensagem = `⚠️ ATENÇÃO: Este backup é do grupo "${data.grupo}" mas você está no grupo "${this.grupoAtual}".\n\nDeseja importar mesmo assim? Os dados serão aplicados ao grupo atual.`;
                }
                
                if (confirm(mensagem)) {
                    this.casaisPastoral = data.casaisPastoral || [];
                    this.familiasSorteadas = data.familiasSorteadas || [];
                    this.escala = data.escala || [];
                    this.tercos = data.tercos || [];
                    this.saveData('casaisPastoral', this.casaisPastoral);
                    this.saveData('familiasSorteadas', this.familiasSorteadas);
                    this.saveData('escala', this.escala);
                    this.saveData('tercos', this.tercos);
                    this.render();
                    alert('✅ Dados importados com sucesso!');
                    localStorage.setItem(`ultimoBackup_${this.grupoAtual}`, new Date().toISOString());
                }
            } catch (error) {
                alert('❌ Erro ao importar arquivo. Verifique se é um backup válido.');
            }
        };
        reader.readAsText(file);
    }

    setupAutoBackup() {
        setInterval(() => {
            this.criarBackupAutomatico();
        }, 432000000);
    }

    criarBackupAutomatico() {
        if (!this.grupoAtual) return;
        
        const data = {
            grupo: this.grupoAtual,
            casaisPastoral: this.casaisPastoral,
            familiasSorteadas: this.familiasSorteadas,
            escala: this.escala,
            tercos: this.tercos,
            dataBackup: new Date().toISOString()
        };
        localStorage.setItem(`backupAutomatico_${this.grupoAtual}`, JSON.stringify(data));
        localStorage.setItem(`ultimoBackupAutomatico_${this.grupoAtual}`, new Date().toISOString());
        console.log(`✅ Backup automático criado (${this.grupoAtual}):`, new Date().toLocaleString('pt-BR'));
    }

    verificarBackupPendente() {
        if (!this.grupoAtual) return;
        
        const ultimoBackup = localStorage.getItem(`ultimoBackup_${this.grupoAtual}`);
        const hoje = new Date();
        
        if (!ultimoBackup) {
            setTimeout(() => {
                if (confirm('⚠️ IMPORTANTE: Você ainda não fez backup dos dados deste grupo!\n\nRecomendamos fazer backup regularmente para não perder informações.\n\nDeseja fazer backup agora?')) {
                    this.exportData();
                    localStorage.setItem(`ultimoBackup_${this.grupoAtual}`, new Date().toISOString());
                }
            }, 5000);
            return;
        }

        const dataUltimoBackup = new Date(ultimoBackup);
        const diasSemBackup = Math.floor((hoje - dataUltimoBackup) / (1000 * 60 * 60 * 24));

        if (diasSemBackup >= 10) {
            setTimeout(() => {
                if (confirm(`⚠️ AVISO: Último backup deste grupo foi há ${diasSemBackup} dias!\n\nRecomendamos fazer backup regularmente para segurança dos dados.\n\nDeseja fazer backup agora?`)) {
                    this.exportData();
                    localStorage.setItem(`ultimoBackup_${this.grupoAtual}`, new Date().toISOString());
                }
            }, 3000);
        }
    }

    restaurarBackupAutomatico() {
        if (!this.grupoAtual) return;
        
        const backup = localStorage.getItem(`backupAutomatico_${this.grupoAtual}`);
        if (!backup) {
            alert('❌ Nenhum backup automático encontrado para este grupo.');
            return;
        }

        try {
            const data = JSON.parse(backup);
            const dataBackup = new Date(data.dataBackup).toLocaleString('pt-BR');
            
            if (confirm(`Restaurar backup automático de ${dataBackup}?\n\nGrupo: ${data.grupo}\n\nIsso substituirá os dados atuais deste grupo.`)) {
                this.casaisPastoral = data.casaisPastoral || [];
                this.familiasSorteadas = data.familiasSorteadas || [];
                this.escala = data.escala || [];
                this.tercos = data.tercos || [];
                this.saveData('casaisPastoral', this.casaisPastoral);
                this.saveData('familiasSorteadas', this.familiasSorteadas);
                this.saveData('escala', this.escala);
                this.saveData('tercos', this.tercos);
                this.render();
                alert('✅ Backup automático restaurado com sucesso!');
            }
        } catch (error) {
            alert('❌ Erro ao restaurar backup automático.');
        }
    }

    testarPersistencia() {
        const testes = [];
        
        const nomes = {
            'sabado-19h30': '🕯️ Sábado 19h30',
            'domingo-7h30': '🌅 Domingo 7h30',
            'domingo-9h30': '☀️ Domingo 9h30',
            'domingo-17h-capela': '⛪ Domingo 17h Capela',
            'domingo-19h': '🌙 Domingo 19h'
        };

        testes.push({
            nome: 'Grupo selecionado',
            resultado: this.grupoAtual !== null,
            detalhes: nomes[this.grupoAtual] || this.grupoAtual
        });

        testes.push({
            nome: 'localStorage disponível',
            resultado: typeof(Storage) !== 'undefined'
        });

        try {
            localStorage.setItem('teste', 'valor');
            localStorage.removeItem('teste');
            testes.push({
                nome: 'Escrita/Leitura localStorage',
                resultado: true
            });
        } catch (e) {
            testes.push({
                nome: 'Escrita/Leitura localStorage',
                resultado: false,
                erro: e.message
            });
        }

        testes.push({
            nome: 'Casais Pastoral carregados',
            resultado: this.casaisPastoral.length > 0,
            detalhes: `${this.casaisPastoral.length} casais`
        });

        testes.push({
            nome: 'Famílias Sorteadas',
            resultado: true,
            detalhes: `${this.familiasSorteadas.length} famílias`
        });

        testes.push({
            nome: 'Escala definida',
            resultado: true,
            detalhes: `${this.escala.length} meses`
        });

        testes.push({
            nome: 'Terços agendados',
            resultado: true,
            detalhes: `${this.tercos.length} terços`
        });

        const backupAuto = localStorage.getItem(`backupAutomatico_${this.grupoAtual}`);
        testes.push({
            nome: 'Backup automático existe',
            resultado: backupAuto !== null,
            detalhes: backupAuto ? `Criado em ${new Date(JSON.parse(backupAuto).dataBackup).toLocaleString('pt-BR')}` : 'Nenhum ainda'
        });

        const ultimoBackup = localStorage.getItem(`ultimoBackup_${this.grupoAtual}`);
        testes.push({
            nome: 'Backup manual realizado',
            resultado: ultimoBackup !== null,
            detalhes: ultimoBackup ? `Em ${new Date(ultimoBackup).toLocaleString('pt-BR')}` : 'Nunca'
        });

        let relatorio = `🧪 TESTE DE PERSISTÊNCIA - ${nomes[this.grupoAtual]}\n\n`;
        testes.forEach(teste => {
            const status = teste.resultado ? '✅' : '❌';
            relatorio += `${status} ${teste.nome}`;
            if (teste.detalhes) relatorio += ` - ${teste.detalhes}`;
            if (teste.erro) relatorio += ` (Erro: ${teste.erro})`;
            relatorio += '\n';
        });

        const todosPassaram = testes.filter(t => !t.nome.includes('Backup')).every(t => t.resultado);
        relatorio += `\n${todosPassaram ? '✅ SISTEMA FUNCIONANDO CORRETAMENTE!' : '⚠️ ALGUNS TESTES FALHARAM'}`;

        console.log(relatorio);
        alert(relatorio);

        return todosPassaram;
    }

    loginAdmin() {
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPass').value;

        if (user === 'thales' && pass === 'thales') {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            
            document.getElementById('testarBtn').onclick = () => this.testarPersistencia();
            document.getElementById('restaurarAutoBtn').onclick = () => this.restaurarBackupAutomatico();
            document.getElementById('limparDadosBtn').onclick = () => this.limparTodosDados();
        } else {
            alert('❌ Usuário ou senha incorretos');
            document.getElementById('adminPass').value = '';
        }
    }

    logoutAdmin() {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminUser').value = '';
        document.getElementById('adminPass').value = '';
    }

    limparTodosDados() {
        if (confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados do sistema!\n\nTem certeza que deseja continuar?')) {
            if (confirm('🚨 ÚLTIMA CONFIRMAÇÃO: Todos os casais, famílias, terços e escala serão perdidos!\n\nDeseja realmente limpar tudo?')) {
                localStorage.clear();
                this.casaisPastoral = [];
                this.familiasSorteadas = [];
                this.escala = [];
                this.tercos = [];
                this.render();
                alert('✅ Todos os dados foram removidos. A página será recarregada.');
                window.location.reload();
            }
        }
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PastoralManager();
});
