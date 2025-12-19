// SCRIPT DE BACKUP DO LOCALSTORAGE PARA FIREBASE
// Execute este script no console do navegador para fazer backup dos dados

function backupLocalStorageToFile() {
    const backup = {
        timestamp: new Date().toISOString(),
        grupos: {}
    };

    // Pegar todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        try {
            backup.grupos[key] = JSON.parse(value);
        } catch (e) {
            backup.grupos[key] = value;
        }
    }

    // Criar arquivo JSON
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('✅ Backup do localStorage criado!');
    console.log('Total de chaves:', Object.keys(backup.grupos).length);
}

// Executar backup
backupLocalStorageToFile();
