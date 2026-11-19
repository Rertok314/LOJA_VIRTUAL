const test = require('node:test');
const assert = require('node:assert/strict');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function chamar(rota, { method = 'GET', body, token } = {}) {
  const r = await fetch(BASE + rota, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  return { status: r.status, data: await r.json() };
}

async function entrar(email) {
  const r = await chamar('/api/auth/login', {
    method: 'POST',
    body: { email, password: 'SenhaDidatica123!' }
  });
  assert.equal(r.status, 200, 'Pré-condição: login deve funcionar');
  assert.ok(r.data.token);
  return r.data.token;
}

const endereco = {
  street: 'Rua Teste',
  number: '10',
  district: 'Centro',
  city: 'Maricá',
  state: 'RJ',
  zip: '24900000'
};

test('integração: pedido reduz estoque', async () => {
  const token = await entrar('cliente-a@loja.test');
  const antes = await chamar('/api/products/produto-teste');
  assert.equal(antes.status, 200);
  assert.ok(antes.data.stock >= 2, 'Resetar dados antes da prática');
  const compra = await chamar('/api/checkout', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: 'produto-teste', quantity: 2 }],
      address: endereco
    }
  });
  assert.equal(compra.status, 201);
  const depois = await chamar('/api/products/produto-teste');
  assert.equal(depois.status, 200);
  assert.equal(depois.data.stock, antes.data.stock - 2);
});

test('integração: pedido criado pode ser consultado', async () => {
  const token = await entrar('cliente-a@loja.test');
  const compra = await chamar('/api/checkout', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: 'produto-teste', quantity: 1 }],
      address: endereco
    }
  });
  assert.equal(compra.status, 201);
  assert.ok(compra.data.order.id);
  const consulta = await chamar('/api/orders/' + compra.data.order.id, { token });
  assert.equal(consulta.status, 200);
  assert.equal(consulta.data.id, compra.data.order.id);
});

test('integração: compra acima do estoque é recusada com erro 400', async () => {
  const token = await entrar('cliente-a@loja.test');
  const produto = await chamar('/api/products/produto-teste');
  assert.equal(produto.status, 200);
  const estoqueAtual = produto.data.stock;

  // Tentativa de comprar além do disponível em estoque
  const compra = await chamar('/api/checkout', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: 'produto-teste', quantity: estoqueAtual + 1 }],
      address: endereco
    }
  });

  assert.equal(compra.status, 400);
  assert.match(compra.data.error, /estoque/i);

  // O estoque não deve ter sido alterado
  const depois = await chamar('/api/products/produto-teste');
  assert.equal(depois.data.stock, estoqueAtual);
});

test('integração: compra da última unidade zera o estoque sem erros', async () => {
  const token = await entrar('cliente-b@loja.test');
  const produto = await chamar('/api/products/produto-teste');
  assert.equal(produto.status, 200);
  const estoqueRestante = produto.data.stock;
  assert.ok(estoqueRestante > 0, 'Deve haver unidades restantes em estoque para zerar');

  // Compra exatamente a quantidade restante
  const compra = await chamar('/api/checkout', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: 'produto-teste', quantity: estoqueRestante }],
      address: endereco
    }
  });

  assert.equal(compra.status, 201);

  // O estoque após a compra deve ser exatamente zero
  const depois = await chamar('/api/products/produto-teste');
  assert.equal(depois.status, 200);
  assert.equal(depois.data.stock, 0);

  // Nova tentativa de compra com o estoque zerado deve ser rejeitada
  const compraSemEstoque = await chamar('/api/checkout', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: 'produto-teste', quantity: 1 }],
      address: endereco
    }
  });
  assert.equal(compraSemEstoque.status, 400);
});