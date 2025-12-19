class SupabaseDB {
    constructor(supabaseClient) {
        this.db = supabaseClient;
        console.log('✅ SupabaseDB inicializado');
    }

    async getCasaisPastoral(grupoId) {
        const { data, error } = await this.db
            .from('casais_pastoral')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('cadastro_em', { ascending: true });
        
        if (error) {
            console.error('❌ Erro ao buscar casais:', error);
            return [];
        }
        return (data || []).map(c => ({
            id: c.id,
            nome1: c.nome1,
            telefone1: c.telefone1,
            nome2: c.nome2,
            telefone2: c.telefone2,
            cadastroEm: c.cadastro_em
        }));
    }

    async addCasalPastoral(grupoId, casal) {
        const { data, error } = await this.db
            .from('casais_pastoral')
            .insert([{ ...casal, grupo_id: grupoId }])
            .select();
        
        if (error) {
            console.error('❌ Erro ao adicionar casal:', error);
            throw error;
        }
        return data[0];
    }

    async updateCasalPastoral(id, updates) {
        const { data, error } = await this.db
            .from('casais_pastoral')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('❌ Erro ao atualizar casal:', error);
            throw error;
        }
        return data[0];
    }

    async deleteCasalPastoral(id) {
        const { error } = await this.db
            .from('casais_pastoral')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('❌ Erro ao deletar casal:', error);
            throw error;
        }
        return true;
    }

    async getFamiliasSorteadas(grupoId) {
        const { data, error } = await this.db
            .from('familias_sorteadas')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('cadastro_em', { ascending: false });
        
        if (error) {
            console.error('❌ Erro ao buscar famílias:', error);
            return [];
        }
        return data || [];
    }

    async addFamiliaSorteada(grupoId, familia) {
        const { data, error } = await this.db
            .from('familias_sorteadas')
            .insert([{ ...familia, grupo_id: grupoId }])
            .select();
        
        if (error) {
            console.error('❌ Erro ao adicionar família:', error);
            throw error;
        }
        return data[0];
    }

    async updateFamiliaSorteada(id, updates) {
        const { data, error } = await this.db
            .from('familias_sorteadas')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('❌ Erro ao atualizar família:', error);
            throw error;
        }
        return data[0];
    }

    async deleteFamiliaSorteada(id) {
        const { error} = await this.db
            .from('familias_sorteadas')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('❌ Erro ao deletar família:', error);
            throw error;
        }
        return true;
    }

    async getEscala(grupoId) {
        const { data, error } = await this.db
            .from('escala')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('cadastro_em', { ascending: true });
        
        if (error) {
            console.error('❌ Erro ao buscar escala:', error);
            return [];
        }
        return data || [];
    }

    async addEscala(grupoId, escala) {
        const { data, error } = await this.db
            .from('escala')
            .insert([{ ...escala, grupo_id: grupoId }])
            .select();
        
        if (error) {
            console.error('❌ Erro ao adicionar escala:', error);
            throw error;
        }
        return data[0];
    }

    async deleteEscala(grupoId, mes) {
        const { error } = await this.db
            .from('escala')
            .delete()
            .eq('grupo_id', grupoId)
            .eq('mes', mes);
        
        if (error) {
            console.error('❌ Erro ao deletar escala:', error);
            throw error;
        }
        return true;
    }

    async getTercos(grupoId) {
        const { data, error } = await this.db
            .from('tercos')
            .select('*')
            .eq('grupo_id', grupoId)
            .order('data', { ascending: true });
        
        if (error) {
            console.error('❌ Erro ao buscar terços:', error);
            return [];
        }
        return data || [];
    }

    async addTerco(grupoId, terco) {
        const { data, error } = await this.db
            .from('tercos')
            .insert([{ ...terco, grupo_id: grupoId }])
            .select();
        
        if (error) {
            console.error('❌ Erro ao adicionar terço:', error);
            throw error;
        }
        return data[0];
    }

    async updateTerco(id, updates) {
        const { data, error } = await this.db
            .from('tercos')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('❌ Erro ao atualizar terço:', error);
            throw error;
        }
        return data[0];
    }

    async deleteTerco(id) {
        const { error } = await this.db
            .from('tercos')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('❌ Erro ao deletar terço:', error);
            throw error;
        }
        return true;
    }

    async migrarLocalStorage(grupoId) {
        console.log(`🔄 Migrando dados do grupo ${grupoId}...`);
        
        try {
            const casais = JSON.parse(localStorage.getItem(`grupo_${grupoId}_casaisPastoral`) || '[]');
            const familias = JSON.parse(localStorage.getItem(`grupo_${grupoId}_familiasSorteadas`) || '[]');
            const escala = JSON.parse(localStorage.getItem(`grupo_${grupoId}_escala`) || '[]');
            const tercos = JSON.parse(localStorage.getItem(`grupo_${grupoId}_tercos`) || '[]');

            if (casais.length > 0) {
                const casaisComGrupo = casais.map(c => ({ ...c, grupo_id: grupoId }));
                await this.db.from('casais_pastoral').insert(casaisComGrupo);
                console.log(`✅ ${casais.length} casais migrados`);
            }

            if (familias.length > 0) {
                const familiasComGrupo = familias.map(f => ({ ...f, grupo_id: grupoId }));
                await this.db.from('familias_sorteadas').insert(familiasComGrupo);
                console.log(`✅ ${familias.length} famílias migradas`);
            }

            if (escala.length > 0) {
                const escalaComGrupo = escala.map(e => {
                    const { id, ...rest } = e;
                    return { ...rest, grupo_id: grupoId };
                });
                await this.db.from('escala').insert(escalaComGrupo);
                console.log(`✅ ${escala.length} escalas migradas`);
            }

            if (tercos.length > 0) {
                const tercosComGrupo = tercos.map(t => ({ ...t, grupo_id: grupoId }));
                await this.db.from('tercos').insert(tercosComGrupo);
                console.log(`✅ ${tercos.length} terços migrados`);
            }

            console.log(`✅ Migração do grupo ${grupoId} concluída!`);
            return true;
        } catch (error) {
            console.error(`❌ Erro na migração do grupo ${grupoId}:`, error);
            return false;
        }
    }

    async limparDadosGrupo(grupoId) {
        try {
            await this.db.from('tercos').delete().eq('grupo_id', grupoId);
            await this.db.from('escala').delete().eq('grupo_id', grupoId);
            await this.db.from('familias_sorteadas').delete().eq('grupo_id', grupoId);
            await this.db.from('casais_pastoral').delete().eq('grupo_id', grupoId);
            console.log(`✅ Dados do grupo ${grupoId} limpos`);
            return true;
        } catch (error) {
            console.error(`❌ Erro ao limpar dados do grupo ${grupoId}:`, error);
            return false;
        }
    }

    subscribeToChanges(grupoId, table, callback) {
        return this.db
            .channel(`${table}-${grupoId}`)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: table,
                    filter: `grupo_id=eq.${grupoId}`
                },
                callback
            )
            .subscribe();
    }
}

const supaDB = new SupabaseDB(supabaseClient);
