joseelias@MacBook-Pro-de-Jose alunos % k6 run --summary-export=resultado-estresse.json tests/carga/estresse.js
  scenarios: Up to 30 looping VUs for 1m30s over 5 stages
  ✓ 'rate>0.95' rate=100.00%
  ✓ 'p(95)<1000' p(95)=20.51ms
  ✓ 'rate<0.05' rate=0.00%
  checks_total.......: 2096 (100% succeeded)
  http_req_duration..: avg=13.39ms med=11.75ms max=74.74ms p(95)=20.51ms
  http_req_failed....: 0.00% (0 out of 2096)
  http_reqs..........: 2096 (23.177471/s)
  data_received......: 2.2 GB (25 MB/s)

joseelias@MacBook-Pro-de-Jose alunos % k6 run --summary-export=resultado-recuperacao.json tests/carga/carga.js
  scenarios: 5 max VUs for 30s
  ✓ 'rate>0.99' rate=100.00%
  ✓ 'p(95)<500' p(95)=49.83ms
  ✓ 'rate<0.01' rate=0.00%
  checks_total.......: 290 (100% succeeded)
  http_req_duration..: avg=18.22ms med=14.92ms max=65.85ms p(95)=49.83ms
  http_req_failed....: 0.00% (0 out of 145)
  http_reqs..........: 145 (4.778819/s)
  data_received......: 154 MB (5.1 MB/s)
