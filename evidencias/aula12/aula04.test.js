const test = require('node:test');
const assert = require('node:assert/strict');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function getProdutos(query = '') {
  const inicio = performance.now();
  const url = `${BASE}/api/products${query ? '?' + query : ''}`;
  const res = await fetch(url);
  const duracao = performance.now() - inicio;
  const dados = await res.json();
  return { status: res.status, dados, duracao };
}

// ---------------------------------------------------------------------
// CASO 1: Latência e tempo de resposta dentro do critério de qualidade
// Critério da aula: p95 < 500 ms (limite ilustrativo máximo de 2 segundos)
// ---------------------------------------------------------------------
test('desempenho: rota /api/products responde dentro do limite aceitável (< 500ms)', async () => {
  const { status, duracao } = await getProdutos();
  assert.equal(status, 200, 'A rota de produtos deve responder com status HTTP 200');
  assert.ok(
    duracao < 500,
    `Tempo de resposta de ${duracao.toFixed(2)}ms excedeu o critério de aceitação de 500ms`
  );
});

// ---------------------------------------------------------------------
// CASO 2: Integridade de estrutura e conteúdo da lista de produtos
// Critério da aula: Respostas com estrutura esperada e apenas produtos ativos
// ---------------------------------------------------------------------
test('desempenho: rota /api/products devolve lista não vazia com estrutura e catálogo ativo', async () => {
  const { status, dados } = await getProdutos();
  assert.equal(status, 200);
  assert.ok(Array.isArray(dados), 'A resposta da API de produtos deve ser um array');
  assert.ok(dados.length > 0, 'O catálogo de produtos não deve ser vazio');

  // Validação estrutural do primeiro produto
  const produto = dados[0];
  assert.ok(produto.id, 'Produto deve conter o campo id');
  assert.ok(produto.name, 'Produto deve conter o campo name');
  assert.ok(typeof produto.price === 'number', 'Produto deve conter price numérico em reais');
  assert.ok(typeof produto.stock === 'number', 'Produto deve conter stock numérico');
  assert.ok(produto.category, 'Produto deve conter category');

  // A API lista somente produtos ativos do catálogo
  const inativos = dados.filter((p) => p.active === false);
  assert.equal(inativos.length, 0, 'A rota /api/products não deve incluir produtos inativos');
});

// ---------------------------------------------------------------------
// CASO 3: Validação de ausência de filtragem no servidor (RNF-06)
// Diretriz da aula: A rota devolve array e não filtra no servidor; a busca é no frontend
// ---------------------------------------------------------------------
test('desempenho: rota /api/products devolve array completo e não filtra no servidor (RNF-06)', async () => {
  const { dados: listaPadrao } = await getProdutos();
  const { dados: listaComQuery } = await getProdutos('busca=produto-teste');

  // O endpoint não filtra parâmetros de busca no servidor; retorna o catálogo completo
  assert.equal(
    listaComQuery.length,
    listaPadrao.length,
    'A busca por texto não deve ser processada no servidor da rota /api/products; deve ser resolvida no frontend'
  );
});

// ---------------------------------------------------------------------
// CASO 4: Concorrência e ausência de falhas técnicas
// Critério da aula: Taxa de falhas técnicas inferior a 1% sob concorrência simultânea
// ---------------------------------------------------------------------
test('desempenho: concorrência de múltiplas requisições simultâneas sem falhas técnicas', async () => {
  const totalRequisicoes = 10;
  const requisicoes = Array.from({ length: totalRequisicoes }, () => getProdutos());

  const resultados = await Promise.all(requisicoes);

  const comSucesso = resultados.filter((r) => r.status === 200 && Array.isArray(r.dados));
  const taxaSucesso = (comSucesso.length / totalRequisicoes) * 100;

  assert.equal(
    taxaSucesso,
    100,
    `Taxa de sucesso concorrente foi de ${taxaSucesso}%, esperava-se 100% (taxa de erro < 1%)`
  );
});
