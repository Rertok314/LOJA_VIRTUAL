Desempenho da Interface (Frontend / DevTools Network)
Enquanto a API suportou o teste com folga, a interface no navegador apresentou 3 problemas graves:
1. Ocioso (RNF-09): Realizou 15 requisições (15.9 MB) sem nenhuma interação do usuário devido a um setInterval em main.js.
2. Busca (RNF-06): Ao digitar "casa", disparou 39 requisições (41.4 MB), fazendo download do catálogo a cada tecla digitada por falta de debounce.
3. Atualizar lista (RNF-07): Disparou 113 requisições (120 MB) para um único clique, pois a função renderCatalog acumula um novo ouvinte de evento a cada renderização.
