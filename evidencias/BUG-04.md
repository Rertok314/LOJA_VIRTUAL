2. BOTÃO INACESSÍVEL VIA TECLADO NO CATÁLOGO (RNF-02)
- O que ocorria antes:
  O botão "Adicionar ao carrinho" foi construído na tela utilizando uma tag <div> estilizada. Por não ser um elemento nativo de botão, ele era ignorado pela tecla Tab durante a navegação por teclado, impedindo que pessoas com deficiência motora ou que navegam sem mouse conseguissem adicionar produtos e concluir compras.
- O que foi feito de correção:
  No arquivo public/js/catalog.js, substituímos a criação da <div> por um elemento semântico de botão:
  const add = document.createElement("button");
  add.type = "button";
