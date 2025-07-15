# Gerenciamento com systemd

A aplicação DigiUrban agora usa systemd em vez do PM2 para maior estabilidade e controle.

## Comandos Úteis

### Status do Serviço
```bash
# Verificar status
systemctl status digiurban.service

# Via npm
npm run service:status
```

### Controle do Serviço
```bash
# Iniciar
systemctl start digiurban.service
npm run service:start

# Parar
systemctl stop digiurban.service
npm run service:stop

# Reiniciar
systemctl restart digiurban.service
npm run service:restart

# Recarregar configuração
systemctl reload digiurban.service
```

### Logs
```bash
# Logs em tempo real
journalctl -u digiurban.service -f
npm run logs:production

# Últimas 50 linhas
journalctl -u digiurban.service -n 50
npm run logs:recent

# Logs desde ontem
journalctl -u digiurban.service --since yesterday

# Logs com prioridade de erro
journalctl -u digiurban.service -p err
```

### Deploy
```bash
# Deploy usando systemd
npm run deploy

# Deploy legado (Docker)
npm run deploy:legacy
```

## Arquivos Importantes

- `/etc/systemd/system/digiurban.service` - Arquivo de serviço
- `/opt/digiurban/logs/digiurban.log` - Log da aplicação
- `/opt/digiurban/logs/digiurban-error.log` - Log de erros
- `/opt/digiurban/current/.env` - Variáveis de ambiente

## Vantagens do systemd

- ✅ **Estabilidade**: Mais confiável que PM2
- ✅ **Logs Centralizados**: Integrado com journald
- ✅ **Auto-restart**: Reinicia automaticamente em caso de falha
- ✅ **Segurança**: Isolamento de processos e permissões
- ✅ **Monitoramento**: Status detalhado e métricas
- ✅ **Boot**: Inicia automaticamente no boot do sistema

## Solução de Problemas

### Serviço não inicia
```bash
# Verificar logs
journalctl -u digiurban.service -n 100

# Verificar configuração
systemctl status digiurban.service

# Recarregar daemon
systemctl daemon-reload
systemctl restart digiurban.service
```

### Problemas de permissão
```bash
# Verificar ownership
ls -la /opt/digiurban/

# Corrigir permissões
chown -R digiurban:digiurban /opt/digiurban
chmod -R 755 /opt/digiurban
```

### Port já em uso
```bash
# Verificar quem está usando a porta
netstat -tlnp | grep :3003
lsof -i :3003

# Matar processo se necessário
kill -9 <PID>
```