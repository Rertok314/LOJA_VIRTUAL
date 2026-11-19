# Loja Aurora — Guia Rápido de Execução e Testes (P2)

Instruções diretas para instalar, rodar a aplicação e executar todos os testes da disciplina.

---

## 1. Como Instalar as Dependências

Abra o terminal dentro da pasta `alunos` e cole:

```bash
npm install
npx playwright install chromium
```

---

## 2. Como Preparar o Banco de Dados (Reset)

Antes de ligar o servidor ou rodar os testes, resete os dados para o estado inicial:

```bash
npm run reset
```

---

## 3. Como Iniciar a Aplicação (Ligar a Loja)

Para colocar a loja no ar:

```bash
npm start
```

* A loja vai abrir no endereço: **http://127.0.0.1:3000**
* **Importante:** Deixe esse terminal aberto rodando!
* Para parar o servidor quando terminar, aperte `Ctrl + C`.

---

## 4. Como Rodar os Testes

Abra um **SEGUNDO terminal** (sem fechar o primeiro onde a loja está rodando) e execute os comandos abaixo conforme o que você quer testar:

### A) Rodar Todos os Testes Automáticos (Unitário e Integração)
Executa a suíte completa de testes do Node.js:
```bash
npm test
```

### B) Rodar os Testes por Arquivo / Aula
* **Aula 1 (Unitários — Descontos, Frete e Quantidades):**
  ```bash
  node --test tests/aula01.test.js
  node --test tests/aula01_1.test.js
  ```
* **Aula 2 (Integração — Baixa de Estoque e Consulta de Pedidos):**
  ```bash
  node --test tests/aula02.test.js
  ```
* **Aula 3 (Confirmação e Regressão — Cupons de Desconto):**
  ```bash
  node --test tests/aula03.test.js
  ```
* **Aula 4 (Desempenho e Integridade da API de Produtos):**
  ```bash
  node --test tests/aula04.test.js
  ```

### C) Rodar os Testes de Interface e Acessibilidade (Playwright)
Executa os testes de tela no navegador (cadastro, compra e navegação por teclado):
```bash
npx playwright test aula04.spec.cjs
```
Para ver o relatório visual com os gráficos e telas dos testes:
```bash
npx playwright show-report
```

### D) Rodar os Testes de Carga e Estresse (k6)
* **Teste de Carga (5 usuários simultâneos por 30s):**
  ```bash
  k6 run --summary-export=resultado-carga.json tests/carga/carga.js
  ```
* **Teste de Estresse (rampa até 30 usuários simultâneos):**
  ```bash
  k6 run --summary-export=resultado-estresse.json tests/carga/estresse.js
  ```
* **Teste de Recuperação pós-estresse:**
  ```bash
  k6 run --summary-export=resultado-recuperacao.json tests/carga/carga.js
  ```

---

## 5. Contas e Dados de Teste

* **Endereço da Loja:** `http://127.0.0.1:3000`
* **Contas Locais (Mesma senha para todas):**
  * `cliente-a@loja.test` — Senha: `SenhaDidatica123!`
  * `cliente-b@loja.test` — Senha: `SenhaDidatica123!`
  * `admin@loja.test` — Senha: `SenhaDidatica123!`
* **Produto Padrão de Teste:** `produto-teste` (Preço: R$ 150,00 | Estoque inicial: 5)
* **Cupons Didáticos:**
  * `VINTE` (20% de desconto)
  * `BEMVINDO` (R$ 30,00 de desconto fixo)
# LOJA_VIRTUAL
