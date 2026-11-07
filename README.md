# BAIRROVIVO

## Manual de inicialização e execução após reiniciar o computador

**Arquitetura:** React + Vite (Vercel) | Spring Boot (Local) | Oracle Database 19c | Cloudflare Quick Tunnel

---

## 1. Visão geral da arquitetura

O BairroVivo possui seu frontend publicado no Vercel, mas o backend e o banco de dados permanecem no computador local.

O funcionamento depende de três serviços:

1. **Oracle Database 19c:** armazena os dados do sistema.
2. **Spring Boot:** disponibiliza a API na porta 8080.
3. **Cloudflare Tunnel:** disponibiliza a API local na internet por meio de um endereço HTTPS.

O fluxo de comunicação é:

```text
USUÁRIO
   |
   v
FRONTEND — VERCEL
https://bairro-vivo.vercel.app
   |
   v
CLOUDFLARE QUICK TUNNEL
https://ENDERECO.trycloudflare.com
   |
   v
BACKEND — SPRING BOOT
http://localhost:8080
   |
   v
BANCO DE DADOS — ORACLE 19c
Localizado no computador
```

**Importante:** o frontend continua publicado no Vercel. Não é necessário iniciar o React localmente para que o site funcione.

---

## 2. Pré-requisitos

Antes de iniciar o BairroVivo, verifique se possui:

- Computador ligado e conectado à internet.
- Oracle Database 19c instalado.
- Oracle SQL Developer instalado.
- IntelliJ IDEA com o projeto Spring Boot.
- Cloudflare Tunnel (`cloudflared`) instalado.
- Acesso ao projeto BairroVivo no Vercel.

O computador precisa permanecer ligado e sem entrar em suspensão enquanto o sistema estiver sendo utilizado.

---

## 3. Etapa 1 — Iniciar o Oracle Database 19c

O SQL Developer é apenas uma ferramenta de gerenciamento do banco. O Oracle Database precisa estar executando independentemente dele.

### 3.1. Abrir os serviços do Windows

1. Pressione `Win + R`.
2. Digite:

```text
services.msc
```

3. Pressione Enter.
4. Procure os serviços relacionados ao Oracle.

Normalmente, você encontrará serviços semelhantes a:

```text
OracleService<SID>
OracleOraDB19Home...TNSListener
```

Os nomes exatos podem variar conforme a instalação.

### 3.2. Verificar os serviços

Verifique se:

- O serviço do Oracle Database está em execução.
- O serviço Oracle TNS Listener está em execução.

Caso estejam parados, clique com o botão direito e selecione **Iniciar**.

Se estiverem configurados para inicialização automática, poderão iniciar sozinhos com o Windows.

### 3.3. Testar o banco

1. Abra o Oracle SQL Developer.
2. Selecione sua conexão `oraclenew`.
3. Clique em Conectar.
4. Execute:

```sql
SELECT SYSDATE FROM DUAL;
```

Se retornar a data atual do banco, a conexão está funcionando.

**Resultado esperado:** Oracle 19c disponível para receber conexões do Spring Boot.

---

## 4. Etapa 2 — Iniciar o backend Spring Boot

Agora precisamos iniciar a API responsável pela comunicação entre o frontend e o Oracle.

### 4.1. Abrir o IntelliJ

1. Abra o IntelliJ IDEA.
2. Abra o projeto Backend do BairroVivo.
3. Aguarde o carregamento das dependências.
4. Localize a classe principal do Spring Boot, que contém a anotação `@SpringBootApplication`.

### 4.2. Executar a aplicação

Clique no botão verde de execução do IntelliJ.

Aguarde até aparecer uma mensagem semelhante a:

```text
Tomcat started on port 8080
Started BairroVivoApplication
```

O nome da classe pode ser diferente no seu projeto.

### 4.3. Testar o backend localmente

Abra o navegador e acesse:

```text
http://localhost:8080/usuario
```

O esperado é receber a lista de usuários em formato JSON.

Também pode testar:

```text
http://localhost:8080/bairro
http://localhost:8080/categoria
http://localhost:8080/ocorrencia
```

Se os endpoints retornarem dados, o backend está funcionando e conectado ao banco.

**Não prossiga se o backend apresentar erros de conexão com o Oracle.**

---

## 5. Etapa 3 — Iniciar o Cloudflare Tunnel

Esta etapa disponibiliza sua API local para o frontend publicado na internet.

### 5.1. Abrir o PowerShell

Abra uma nova janela do PowerShell.

Não feche o IntelliJ nem a aplicação Spring Boot.

### 5.2. Executar o comando

Digite:

```powershell
cloudflared tunnel --url http://localhost:8080
```

Pressione Enter.

### 5.3. Aguardar a criação do túnel

O Cloudflare irá gerar um endereço público semelhante a:

```text
https://alguma-palavra.trycloudflare.com
```

Esse endereço será utilizado pelo frontend para acessar a API.

**Atenção:** cada novo Quick Tunnel pode gerar um endereço diferente.

### 5.4. Testar o endereço público

Copie o endereço gerado e acrescente `/usuario`.

Exemplo:

```text
https://alguma-palavra.trycloudflare.com/usuario
```

Se aparecer a lista de usuários em JSON, o túnel está funcionando.

Mantenha a janela do PowerShell aberta durante toda a utilização do sistema.

---

## 6. Etapa 4 — Verificar a URL no Vercel

O frontend utiliza a variável de ambiente `VITE_API_URL` para identificar onde está hospedada a API.

### 6.1. Verificar a variável

1. Acesse o Vercel.
2. Abra o projeto `bairro-vivo`.
3. Entre em Settings.
4. Acesse Environment Variables.
5. Localize:

```text
VITE_API_URL
```

O valor deverá corresponder ao endereço atual do Cloudflare:

```text
https://alguma-palavra.trycloudflare.com
```

Não coloque `/usuario` no final.

### 6.2. Quando preciso atualizar?

Existem dois cenários:

**Cenário A — A URL continua igual**

Se o endereço gerado pelo Cloudflare for exatamente igual ao endereço salvo no Vercel, não precisa alterar nada.

**Cenário B — A URL mudou**

Se o Cloudflare gerar outro endereço:

1. Acesse Settings → Environment Variables no Vercel.
2. Edite `VITE_API_URL`.
3. Coloque o novo endereço.
4. Salve a alteração.
5. Acesse Deployments.
6. Faça um novo Redeploy para aplicar a variável ao frontend.

A variável precisa estar configurada para o ambiente Production.

---

## 7. Etapa 5 — Conferir o CORS

O backend precisa permitir que o frontend publicado no Vercel acesse sua API.

No projeto Spring Boot, a configuração `CorsConfig.java` deve permitir o domínio:

```java
"https://bairro-vivo.vercel.app"
```

Também pode manter o endereço local:

```java
"http://localhost:5173"
```

Exemplo da configuração utilizada:

```java
.allowedOrigins(
    "http://localhost:5173",
    "https://bairro-vivo.vercel.app"
)
.allowedMethods(
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
)
.allowedHeaders("*");
```

Essa configuração deve permanecer no backend.

Não é necessário adicionar o endereço do Cloudflare como origem permitida: a origem da requisição no navegador é o domínio do Vercel.

Se o CORS já estiver configurado e funcionando, não precisa modificá-lo novamente.

---

## 8. Etapa 6 — Testar o BairroVivo publicado

Com Oracle, Spring Boot e Cloudflare em execução:

1. Acesse:

```text
https://bairro-vivo.vercel.app
```

2. Abra a página de login.
3. Verifique se os dados dos usuários são carregados.
4. Acesse a página de cadastro.
5. Teste o cadastro de um usuário.
6. Verifique se o registro foi gravado no Oracle.
7. Teste a listagem de ocorrências.
8. Teste o mapa e os demais recursos que utilizam a API.

Se tudo funcionar, o BairroVivo está disponível.

---

## 9. Resumo: ordem de inicialização

Sempre que reiniciar o computador, siga esta ordem:

| Ordem | Ação                            | Onde executar       |
| ----- | ------------------------------- | ------------------- |
| 1     | Ligar e verificar Oracle 19c    | Serviços do Windows |
| 2     | Testar conexão com o banco      | SQL Developer       |
| 3     | Iniciar Spring Boot             | IntelliJ            |
| 4     | Testar `localhost:8080/usuario` | Navegador           |
| 5     | Executar Cloudflare Tunnel      | PowerShell          |
| 6     | Copiar e testar URL pública     | Navegador           |
| 7     | Conferir `VITE_API_URL`         | Vercel              |
| 8     | Atualizar Vercel se a URL mudou | Vercel              |
| 9     | Testar o site publicado         | Navegador           |

---

## 10. Problemas comuns e soluções

### Problema 1 — O site abre, mas não carrega os usuários

Possíveis causas:

- Backend desligado.
- Oracle Database parado.
- Cloudflare Tunnel encerrado.
- URL do Cloudflare diferente da configurada no Vercel.

Solução: verifique as três aplicações e teste a URL pública `/usuario`.

### Problema 2 — Erro de CORS

Mensagem comum:

```text
No 'Access-Control-Allow-Origin' header
```

Solução:

- Confira o domínio `https://bairro-vivo.vercel.app` no `CorsConfig.java`.
- Reinicie o Spring Boot.
- Verifique se a requisição está chegando ao backend.

### Problema 3 — Erro de conexão com o Oracle

Verifique:

- Se o Oracle Database está em execução.
- Se o Listener está ativo.
- Se a conexão `oraclenew` funciona no SQL Developer.
- Se as credenciais e a URL JDBC do Spring Boot estão corretas.

### Problema 4 — O endereço do Cloudflare mudou

Solução:

1. Copie o novo endereço gerado.
2. Atualize `VITE_API_URL` no Vercel.
3. Faça um novo Redeploy.
4. Teste novamente o site.

### Problema 5 — O site parou de funcionar depois de fechar o PowerShell

Isso acontece porque o Cloudflare Tunnel é executado naquele terminal.

Solução: abra outro PowerShell e execute novamente:

```powershell
cloudflared tunnel --url http://localhost:8080
```

Se a URL mudar, atualize o Vercel conforme explicado anteriormente.

---

## 11. Cuidados de segurança

Como o backend está acessível pela internet por meio do túnel:

- Não exponha a porta 1521 do Oracle.
- Não publique senhas no GitHub.
- Não disponibilize senhas de usuários nas respostas JSON.
- Proteja operações de alteração e exclusão com autenticação e autorização.
- Evite expor endpoints administrativos sem proteção.
- Não compartilhe o endereço público da API desnecessariamente.

O Quick Tunnel é adequado para demonstrações e testes acadêmicos, mas não deve ser considerado uma arquitetura de produção.

---

## 12. Checklist rápido de inicialização

Antes de apresentar o BairroVivo, confira:

- [ ] Computador ligado e conectado à internet.
- [ ] Oracle Database 19c em execução.
- [ ] SQL Developer consegue conectar ao `oraclenew`.
- [ ] Spring Boot iniciado no IntelliJ.
- [ ] `http://localhost:8080/usuario` retorna JSON.
- [ ] Cloudflare Tunnel executando no PowerShell.
- [ ] Endereço público `/usuario` retorna JSON.
- [ ] `VITE_API_URL` corresponde ao endereço atual.
- [ ] CORS permite `https://bairro-vivo.vercel.app`.
- [ ] Frontend publicado funcionando.
- [ ] Cadastro e consulta de ocorrências testados.

**Conclusão:** o frontend do BairroVivo permanece publicado no Vercel. O computador funciona como servidor do backend e do banco Oracle. Para que outras pessoas utilizem o sistema, o computador, o banco, o Spring Boot, a conexão com a internet e o Cloudflare Tunnel precisam permanecer ativos.
