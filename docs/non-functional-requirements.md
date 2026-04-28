# Requisitos Não Funcionais

**Versão**: 1.0  
**Data**: 2026-04-28  
**Status**: Draft

---

## Objetivo

Definir os requisitos não funcionais essenciais do sistema para garantir qualidade, segurança, escalabilidade, confiabilidade e conformidade.

---

## 1. Performance

### RNF-PERF-001
O sistema deve responder às principais operações de leitura em tempo adequado para uso operacional.

### RNF-PERF-002
As principais APIs do MVP devem responder, idealmente, em até:
- 200 ms para operações simples;
- 500 ms para operações moderadas;
- 1 s para operações complexas.

### RNF-PERF-003
Listagens devem suportar paginação, ordenação e filtros.

### RNF-PERF-004
A aplicação deve suportar crescimento progressivo sem reescrita estrutural imediata.

---

## 2. Segurança

### RNF-SEG-001
Toda autenticação deve ocorrer por conexão segura (HTTPS).

### RNF-SEG-002
Senhas devem ser armazenadas com hash forte, como bcrypt ou equivalente.

### RNF-SEG-003
O sistema deve suportar autenticação com segundo fator em evolução do produto.

### RNF-SEG-004
O sistema deve impedir acesso entre workspaces diferentes.

### RNF-SEG-005
Sessões devem expirar conforme política definida.

### RNF-SEG-006
Ações críticas devem exigir validação de permissão.

### RNF-SEG-007
O sistema deve registrar tentativas de acesso inválidas e eventos relevantes de segurança.

---

## 3. Isolamento Multi-tenant

### RNF-MT-001
Os dados devem ser segregados por workspace.

### RNF-MT-002
Nenhum usuário comum deve acessar dados de outro workspace.

### RNF-MT-003
Toda consulta relevante deve respeitar escopo de workspace e, quando necessário, estabelecimento.

---

## 4. Auditoria e Rastreabilidade

### RNF-AUD-001
O sistema deve auditar ações críticas.

### RNF-AUD-002
Logs de auditoria devem conter:
- usuário;
- ação;
- recurso afetado;
- data/hora;
- origem técnica disponível;
- alterações relevantes, quando aplicável.

### RNF-AUD-003
Os logs devem poder ser consultados por filtros administrativos.

---

## 5. Disponibilidade e Confiabilidade

### RNF-DISP-001
O sistema deve ter boa disponibilidade para operação contínua.

### RNF-DISP-002
Falhas em um módulo não devem comprometer totalmente a aplicação quando possível.

### RNF-DISP-003
Erros devem ser tratados de forma previsível, com mensagens adequadas.

---

## 6. Backup e Recuperação

### RNF-BKP-001
Os dados devem possuir rotina de backup.

### RNF-BKP-002
O processo de restauração deve ser testável.

### RNF-BKP-003
Documentação operacional deve prever contingência para falha de banco e falha de aplicação.

---

## 7. Escalabilidade

### RNF-ESC-001
A arquitetura deve permitir crescimento de usuários, clínicas e volume de dados.

### RNF-ESC-002
O sistema deve começar preferencialmente como monólito modular, mantendo separação clara de domínios.

### RNF-ESC-003
A arquitetura deve permitir futura extração de serviços sem quebra estrutural forte.

---

## 8. Usabilidade

### RNF-USA-001
As interfaces devem ser simples o suficiente para uso por perfis administrativos e clínicos.

### RNF-USA-002
O sistema deve reduzir o número de passos para operações comuns.

### RNF-USA-003
Mensagens de erro devem ser compreensíveis.

### RNF-USA-004
A navegação deve respeitar contexto de workspace e clínica.

---

## 9. Compatibilidade

### RNF-COMP-001
A aplicação web deve funcionar nos principais navegadores modernos.

### RNF-COMP-002
A aplicação deve ser responsiva para uso em diferentes resoluções, mesmo que o foco inicial seja desktop.

---

## 10. Observabilidade

### RNF-OBS-001
A aplicação deve possuir logs técnicos suficientes para troubleshooting.

### RNF-OBS-002
Deve ser possível monitorar falhas, tempos de resposta e eventos críticos.

---

## 11. Manutenibilidade

### RNF-MAN-001
O código deve ser organizado de forma modular.

### RNF-MAN-002
O projeto deve possuir documentação mínima para setup e manutenção.

### RNF-MAN-003
Mudanças em um módulo devem minimizar impacto em outros módulos.

---

## 12. Testabilidade

### RNF-TST-001
O backend deve possuir testes automatizados.

### RNF-TST-002
Fluxos críticos devem ter testes de integração.

### RNF-TST-003
Regras de permissão e isolamento por workspace devem ser testadas.

---

## 13. Compliance e Privacidade

### RNF-LGPD-001
O sistema deve respeitar princípios de proteção de dados compatíveis com a LGPD.

### RNF-LGPD-002
Deve haver controle sobre acesso a dados pessoais.

### RNF-LGPD-003
Dados sensíveis devem receber tratamento adequado de armazenamento e acesso.

### RNF-LGPD-004
O sistema deve possibilitar rastreabilidade de acessos administrativos.

---

## 14. Requisitos Operacionais

### RNF-OPS-001
O ambiente local deve subir com facilidade para desenvolvimento.

### RNF-OPS-002
O projeto deve permitir configuração por variáveis de ambiente.

### RNF-OPS-003
A documentação deve explicar setup mínimo do sistema.

---

## Indicadores de Qualidade Sugeridos

- tempo médio de resposta por endpoint;
- taxa de erro por operação;
- uptime;
- cobertura de testes;
- volume de eventos de auditoria;
- falhas de autenticação;
- quantidade de incidentes por release.

---

**Versão**: 1.0  
**Última atualização**: 2026-04-28
