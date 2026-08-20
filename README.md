# BaaS Lera Pay

Aplicação **Banking as a Service (BaaS)** desenvolvida como desafio técnico, com integração ao gateway **Lera Box / BranchPay**.

O projeto possui backend em **NestJS + TypeScript**, frontend em **React + Vite** e persistência de dados em **MySQL**.

---

## Funcionalidades

- Cadastro de usuários
- Autenticação própria com JWT
- Integração com conta do gateway Lera Box
- Consulta de saldo da carteira
- Consulta de extrato com filtros
- Criação de checkout
- Pagamento via PIX
- Pagamento via cartão de crédito
- Consulta de taxas por bandeira e parcelamento
- Persistência da taxa aplicada no pagamento
- Solicitação de saque
- Consulta de status de saque
- Webhooks para:
  - `PAYMENT_PIX`
  - `PAYMENT_CARD`
  - `WITHDRAWAL`
- Validação de assinatura HMAC-SHA256
- Idempotência no processamento de webhooks
- Conciliação por `externalReference`
- Isolamento das operações por usuário autenticado
- Middleware de logging e Correlation ID
- Documentação da API com Swagger

---

## Tecnologias

### Backend

- Node.js
- TypeScript
- NestJS
- TypeORM
- MySQL
- Axios
- JWT
- Passport
- class-validator
- class-transformer
- bcrypt
- Swagger

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

### Infraestrutura

- Railway
- MySQL Railway
- Vercel

---

## Arquitetura

```text
Frontend React / Vite
        |
        | HTTPS / REST
        v
Backend NestJS
        |
        +------> MySQL
        |
        +------> Gateway Lera Box
                    |
                    v
                 Webhooks
                    |
                    v
               Backend NestJS
```

O frontend nunca acessa diretamente as credenciais do gateway.

As credenciais e o token da Lera Box permanecem armazenados e utilizados exclusivamente pelo backend.

---

## Estrutura do projeto

```text
BaaS-Lera_Pay/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── gateway/
│   │   ├── orders/
│   │   ├── transactions/
│   │   ├── users/
│   │   ├── webhooks/
│   │   └── withdrawals/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

# Como executar localmente

## Pré-requisitos

- Node.js
- npm
- MySQL
- Git

---

## Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=baas_db

GATEWAY_BASE_URL=https://api.branchpay.com.br/api

JWT_SECRET=seu-segredo-jwt
JWT_EXPIRES_IN=1d

LERA_WEBHOOK_SECRET=seu-segredo-webhook

FRONTEND_URL=http://localhost:5173
```

Crie o banco:

```sql
CREATE DATABASE baas_db;
```

Execute:

```bash
npm run start:dev
```

Backend local:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/docs
```

---

## Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie:

```text
.env
```

com:

```env
VITE_API_URL=http://localhost:3000
```

Execute:

```bash
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

---

# Autenticação

A aplicação possui autenticação própria utilizando JWT.

## Criar usuário

```http
POST /users
```

Exemplo:

```json
{
  "name": "Felipe Santiago",
  "email": "usuario@email.com",
  "password": "12345678"
}
```

## Login

```http
POST /auth/login
```

Exemplo:

```json
{
  "email": "usuario@email.com",
  "password": "12345678"
}
```

A resposta contém um `accessToken`.

Nas rotas protegidas, envie:

```http
Authorization: Bearer <accessToken>
```

---

# Integração com Lera Box

O gateway utilizado pelo projeto é:

```text
https://api.branchpay.com.br/api
```

A autenticação do gateway é realizada exclusivamente pelo backend.

As credenciais da Lera Box não são enviadas ao frontend.

---

# Carteira

Consulta de saldo:

```http
GET /gateway/wallet
```

Requer JWT.

---

# Extrato

Consulta:

```http
GET /gateway/transactions
```

Filtros disponíveis:

```text
status
type
limit
```

Exemplo:

```http
GET /gateway/transactions?status=APPROVED&type=PIX&limit=10
```

---

# Checkout

## Criar checkout

```http
POST /checkout-links
```

Exemplo PIX:

```json
{
  "amount": 15000,
  "description": "Pedido #123",
  "paymentMethod": "PIX"
}
```

Exemplo cartão:

```json
{
  "amount": 25000,
  "description": "Pedido #124",
  "paymentMethod": "CREDIT_CARD"
}
```

Os valores monetários são armazenados e enviados em **centavos**.

Exemplo:

```text
15000 = R$ 150,00
```

---

# PIX

Pagamento:

```http
POST /checkout-links/{checkoutId}/pix
```

Exemplo:

```json
{
  "payerDocument": "12345678901"
}
```

O backend utiliza o `externalReference` criado no checkout para realizar a conciliação da transação.

---

# Cartão de crédito

Pagamento:

```http
POST /checkout-links/{checkoutId}/card
```

Exemplo:

```json
{
  "cardNumber": "4111111111111111",
  "cardHolder": "MARIA SILVA",
  "expiryMonth": "12",
  "expiryYear": "2030",
  "cvv": "123",
  "installments": 3
}
```

Antes do pagamento, o backend consulta as taxas do gateway e seleciona a taxa correspondente ao número de parcelas.

O frontend não controla diretamente o `feePercent`.

---

# Taxas

Consulta:

```http
GET /gateway/fees
```

Também é possível filtrar por bandeira:

```http
GET /gateway/fees?brand=VISA
```

---

# Saques

Solicitar saque:

```http
POST /withdrawals
```

Exemplo:

```json
{
  "amount": 10000,
  "pixKey": "00020126580014br.gov.bcb.pix...",
  "description": "Saque para conta pessoal",
  "document": "12345678901"
}
```

Consultar status:

```http
GET /withdrawals/{id}
```

---

# Webhooks

Eventos suportados:

```text
PAYMENT_PIX
PAYMENT_CARD
WITHDRAWAL
```

Endpoints:

```http
POST /webhooks/lera-box/pix
POST /webhooks/lera-box/card
POST /webhooks/lera-box/withdrawal
```

Os webhooks não utilizam JWT da aplicação porque são chamados diretamente pelo gateway.

A autenticação é realizada por assinatura:

```text
X-Lera-Box-Signature
```

A assinatura é validada utilizando:

```text
HMAC-SHA256(body, secret)
```

---

# Idempotência

Cada evento recebido é armazenado na tabela de eventos de webhook.

Antes de processar um webhook, o backend verifica se o identificador externo já foi processado.

Isso evita que o mesmo callback atualize a operação mais de uma vez.

---

# Conciliação

As cobranças utilizam um identificador:

```text
externalReference
```

Ele permite relacionar:

```text
Checkout
Order
Transaction
Webhook
```

e manter o status local sincronizado com o gateway.

---

# Correlation ID e logging

Cada requisição recebe um identificador único através do header:

```text
x-correlation-id
```

Caso o cliente não envie esse header, o backend gera um UUID automaticamente.

Exemplo de log:

```text
[correlation-id] GET /gateway/wallet 200 - 120ms
```

---

# Swagger

A documentação interativa da API está disponível em:

```text
https://baas-lerapay-production.up.railway.app/docs
```

No ambiente local:

```text
http://localhost:3000/docs
```

As rotas protegidas utilizam Bearer JWT através do botão **Authorize** do Swagger.

---

# Deploy

## Backend

Hospedado no Railway.

```text
https://baas-lerapay-production.up.railway.app
```

## Frontend

Hospedado na Vercel.

```text
https://baas-lera-iosz75a40-felipedesks-projects.vercel.app
```

## Banco de dados

MySQL hospedado no Railway.

---

# Variáveis de ambiente

## Backend

```env
PORT=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
GATEWAY_BASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
LERA_WEBHOOK_SECRET=
FRONTEND_URL=
```

## Frontend

```env
VITE_API_URL=
```

Nenhum segredo do backend deve ser configurado utilizando prefixo `VITE_`.

---

# Segurança

- JWT para rotas privadas
- Isolamento por usuário
- Tokens do gateway mantidos somente no backend
- Senhas armazenadas utilizando bcrypt
- Validação dos DTOs
- Assinatura HMAC nos webhooks
- Idempotência dos callbacks
- Correlation ID
- CORS configurado para o frontend autorizado

---

# Sandbox

O gateway utiliza ambiente de sandbox.

Pagamentos PIX, cartão e saques podem retornar aleatoriamente:

```text
APPROVED
```

ou:

```text
DENIED
```

A aplicação trata ambos os resultados.

---

# Principais endpoints

```text
POST /users
POST /auth/login

POST /gateway/register
POST /gateway/login
GET  /gateway/fees
GET  /gateway/wallet
GET  /gateway/transactions
POST /gateway/webhooks

POST /checkout-links
POST /checkout-links/{checkoutId}/pix
POST /checkout-links/{checkoutId}/card

POST /withdrawals
GET  /withdrawals/{id}

POST /webhooks/lera-box/pix
POST /webhooks/lera-box/card
POST /webhooks/lera-box/withdrawal
```

---

# Autor

**Felipe Santiago**
