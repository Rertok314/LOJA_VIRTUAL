const test = require('node:test');
const assert = require('node:assert/strict');
const { hasAvailableStock } = require('../src/domain/stock');
const { placeOrder } = require('../src/services/checkout');

function placeOrderMock(estoqueDisponivel, quantidadeDesejada) {
  const db = {
    findProduct: (id) => ({ 
      id, 
      name: 'Produto Teste', 
      price: 100, 
      stock: estoqueDisponivel, 
      active: true 
    }),
    findCoupon: () => null,
    nextOrderId: () => 'ped-1001',
    addOrder: () => {},
    updateProduct: () => {}
  };
  const user = { id: 'cliente-a' };
  const body = {
    items: [{ productId: 'prod-1', quantity: quantidadeDesejada }],
    address: { street: 'Rua A', number: '123', district: 'Bairro', city: 'Cidade', state: 'UF', zip: '12345-678' }
  };
  return placeOrder(db, user, body);
}

test('unitário: estoque 0 com quantidade 1 é inválido', () => {
  assert.equal(hasAvailableStock(1, 0), false);
});

test('unitário: quantidade máxima permitida igual ao estoque (estoque 1, quantidade 1) é válida', () => {
  assert.equal(hasAvailableStock(1, 1), true);
});

test('funcional: pedido com estoque 0 deve ser rejeitado', () => {
  const result = placeOrderMock(0, 1);
  assert.equal(result.ok, false);
});

test('funcional: pedido com quantidade acima do estoque (estoque 1, quantidade 2) deve ser rejeitado', () => {
  const result = placeOrderMock(1, 2);
  assert.equal(result.ok, false);
});