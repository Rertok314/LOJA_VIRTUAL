1. CAMPO DE CADASTRO SEM RÓTULO ASSOCIADO (RNF-01)
- O que ocorria antes:
  O formulário de cadastro apresentava o texto visual "Nome", mas a tag <label> não possuía o atributo 'for' vinculado ao ID do campo. Por causa disso, leitores de tela e métodos de busca acessível (como getByLabel do Playwright) não conseguiam identificar a relação entre o rótulo e o campo, gerando falha no teste automatizado.
- O que foi feito de correção:
  No arquivo public/index.html, adicionamos o atributo for="register-name" na tag <label> (aplicando a mesma amarração para e-mail e senha):
  <label for="register-name">Nome</label>
  <input id="register-name" ...>
