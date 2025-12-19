// Serviço de Banco de Dados Firebase
// Gerencia todas as operações CRUD com Firestore

class FirebaseDB {
    constructor() {
        this.db = firebase.firestore();
        this.grupoAtual = null;
    }

    setGrupo(grupoId) {
        this.grupoAtual = grupoId;
    }

    getGrupoRef() {
        if (!this.grupoAtual) {
            throw new Error('Grupo não selecionado');
        }
        return this.db.collection('grupos').doc(this.grupoAtual);
    }

    // ========== CASAIS PASTORAL ==========
    
    async getCasaisPastoral() {
        try {
            const snapshot = await this.getGrupoRef()
                .collection('casaisPastoral')
                .orderBy('cadastroEm', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar casais:', error);
            return [];
        }
    }

    async addCasalPastoral(casal) {
        try {
            const docRef = await this.getGrupoRef()
                .collection('casaisPastoral')
                .add({
                    ...casal,
                    cadastroEm: firebase.firestore.FieldValue.serverTimestamp()
                });
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao adicionar casal:', error);
            throw error;
        }
    }

    async updateCasalPastoral(id, casal) {
        try {
            await this.getGrupoRef()
                .collection('casaisPastoral')
                .doc(id)
                .update(casal);
        } catch (error) {
            console.error('Erro ao atualizar casal:', error);
            throw error;
        }
    }

    async deleteCasalPastoral(id) {
        try {
            await this.getGrupoRef()
                .collection('casaisPastoral')
                .doc(id)
                .delete();
        } catch (error) {
            console.error('Erro ao deletar casal:', error);
            throw error;
        }
    }

    // ========== FAMÍLIAS SORTEADAS ==========

    async getFamiliasSorteadas() {
        try {
            const snapshot = await this.getGrupoRef()
                .collection('familiasSorteadas')
                .orderBy('dataSorteio', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar famílias:', error);
            return [];
        }
    }

    async addFamilia(familia) {
        try {
            const docRef = await this.getGrupoRef()
                .collection('familiasSorteadas')
                .add({
                    ...familia,
                    cadastroEm: firebase.firestore.FieldValue.serverTimestamp()
                });
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao adicionar família:', error);
            throw error;
        }
    }

    async updateFamilia(id, familia) {
        try {
            await this.getGrupoRef()
                .collection('familiasSorteadas')
                .doc(id)
                .update(familia);
        } catch (error) {
            console.error('Erro ao atualizar família:', error);
            throw error;
        }
    }

    async deleteFamilia(id) {
        try {
            await this.getGrupoRef()
                .collection('familiasSorteadas')
                .doc(id)
                .delete();
        } catch (error) {
            console.error('Erro ao deletar família:', error);
            throw error;
        }
    }

    // ========== ESCALA ==========

    async getEscala() {
        try {
            const snapshot = await this.getGrupoRef()
                .collection('escala')
                .orderBy('month', 'asc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar escala:', error);
            return [];
        }
    }

    async addEscala(escala) {
        try {
            // Usar month como ID do documento
            await this.getGrupoRef()
                .collection('escala')
                .doc(escala.month)
                .set(escala);
            
            return escala.month;
        } catch (error) {
            console.error('Erro ao adicionar escala:', error);
            throw error;
        }
    }

    async deleteEscala(month) {
        try {
            await this.getGrupoRef()
                .collection('escala')
                .doc(month)
                .delete();
        } catch (error) {
            console.error('Erro ao deletar escala:', error);
            throw error;
        }
    }

    // ========== TERÇOS ==========

    async getTercos() {
        try {
            const snapshot = await this.getGrupoRef()
                .collection('tercos')
                .orderBy('data', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar terços:', error);
            return [];
        }
    }

    async addTerco(terco) {
        try {
            const docRef = await this.getGrupoRef()
                .collection('tercos')
                .add({
                    ...terco,
                    cadastroEm: firebase.firestore.FieldValue.serverTimestamp()
                });
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao adicionar terço:', error);
            throw error;
        }
    }

    async updateTerco(id, terco) {
        try {
            await this.getGrupoRef()
                .collection('tercos')
                .doc(id)
                .update(terco);
        } catch (error) {
            console.error('Erro ao atualizar terço:', error);
            throw error;
        }
    }

    async deleteTerco(id) {
        try {
            await this.getGrupoRef()
                .collection('tercos')
                .doc(id)
                .delete();
        } catch (error) {
            console.error('Erro ao deletar terço:', error);
            throw error;
        }
    }

    // ========== LISTENERS (Tempo Real) ==========

    onCasaisPastoralChange(callback) {
        return this.getGrupoRef()
            .collection('casaisPastoral')
            .orderBy('cadastroEm', 'desc')
            .onSnapshot(snapshot => {
                const casais = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(casais);
            });
    }

    onFamiliasChange(callback) {
        return this.getGrupoRef()
            .collection('familiasSorteadas')
            .orderBy('dataSorteio', 'desc')
            .onSnapshot(snapshot => {
                const familias = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(familias);
            });
    }

    onEscalaChange(callback) {
        return this.getGrupoRef()
            .collection('escala')
            .orderBy('month', 'asc')
            .onSnapshot(snapshot => {
                const escala = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(escala);
            });
    }

    onTercosChange(callback) {
        return this.getGrupoRef()
            .collection('tercos')
            .orderBy('data', 'desc')
            .onSnapshot(snapshot => {
                const tercos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(tercos);
            });
    }

    // ========== BACKUP / IMPORTAÇÃO ==========

    async exportGrupo() {
        try {
            const [casais, familias, escala, tercos] = await Promise.all([
                this.getCasaisPastoral(),
                this.getFamiliasSorteadas(),
                this.getEscala(),
                this.getTercos()
            ]);

            return {
                grupo: this.grupoAtual,
                casaisPastoral: casais,
                familiasSorteadas: familias,
                escala: escala,
                tercos: tercos,
                dataExportacao: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erro ao exportar grupo:', error);
            throw error;
        }
    }

    async importGrupo(data) {
        try {
            const batch = this.db.batch();
            const grupoRef = this.getGrupoRef();

            // Importar casais
            if (data.casaisPastoral) {
                for (const casal of data.casaisPastoral) {
                    const ref = grupoRef.collection('casaisPastoral').doc();
                    batch.set(ref, casal);
                }
            }

            // Importar famílias
            if (data.familiasSorteadas) {
                for (const familia of data.familiasSorteadas) {
                    const ref = grupoRef.collection('familiasSorteadas').doc();
                    batch.set(ref, familia);
                }
            }

            // Importar escala
            if (data.escala) {
                for (const item of data.escala) {
                    const ref = grupoRef.collection('escala').doc(item.month);
                    batch.set(ref, item);
                }
            }

            // Importar terços
            if (data.tercos) {
                for (const terco of data.tercos) {
                    const ref = grupoRef.collection('tercos').doc();
                    batch.set(ref, terco);
                }
            }

            await batch.commit();
            console.log('✅ Dados importados com sucesso');
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            throw error;
        }
    }

    // ========== MIGRAÇÃO DO LOCALSTORAGE ==========

    async migrateFromLocalStorage() {
        try {
            console.log('🔄 Iniciando migração do localStorage...');

            // Buscar dados do localStorage
            const prefix = `grupo_${this.grupoAtual}_`;
            const casais = JSON.parse(localStorage.getItem(prefix + 'casaisPastoral') || '[]');
            const familias = JSON.parse(localStorage.getItem(prefix + 'familiasSorteadas') || '[]');
            const escala = JSON.parse(localStorage.getItem(prefix + 'escala') || '[]');
            const tercos = JSON.parse(localStorage.getItem(prefix + 'tercos') || '[]');

            // Importar para Firebase
            await this.importGrupo({
                casaisPastoral: casais,
                familiasSorteadas: familias,
                escala: escala,
                tercos: tercos
            });

            console.log('✅ Migração concluída!');
            console.log(`- ${casais.length} casais`);
            console.log(`- ${familias.length} famílias`);
            console.log(`- ${escala.length} escalas`);
            console.log(`- ${tercos.length} terços`);

            return true;
        } catch (error) {
            console.error('❌ Erro na migração:', error);
            return false;
        }
    }
}

// Instância global
const firebaseDB = new FirebaseDB();
