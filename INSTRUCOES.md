# Sistema de Estoque - Clínica de Estética
## Projeto Angular - Instruções de Execução

### ✅ Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (geralmente vem com Node.js)
- **Angular CLI** (será instalado automaticamente)

### 📋 Passo a Passo para Rodar o Projeto

#### 1. **Instalar Dependências**

```bash
cd estoque-clinica-angular
npm install
```

Aguarde a instalação de todas as dependências (pode levar alguns minutos).

#### 2. **Configurar a URL da API**

Edite o arquivo `src/app/config/api.config.ts` e altere a URL do backend:

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:8080',  // Altere para a URL do seu backend
  timeout: 30000,
};
```

**Exemplo:**
- Se seu backend está em `http://localhost:8080`, deixe como está
- Se está em outra porta ou máquina, altere conforme necessário

#### 3. **Iniciar o Servidor de Desenvolvimento**

```bash
npm start
```

ou

```bash
ng serve
```

A aplicação abrirá automaticamente em `http://localhost:4200`

#### 4. **Testar a Aplicação**

1. Acesse `http://localhost:4200` no seu navegador
2. Clique em **"Cadastre-se aqui"** para criar uma nova conta
3. Preencha os dados e clique em **"Cadastrar"**
4. Você será redirecionado para fazer login
5. Após o login, acesse a tela de **"Meu Estoque"**
6. Teste as funcionalidades:
   - ➕ Adicionar novo produto
   - ✏️ Editar produto
   - 🗑️ Deletar produto
   - ➕ Adicionar quantidade
   - ➖ Remover quantidade

### 🏗️ Estrutura do Projeto

```
estoque-clinica-angular/
├── src/
│   ├── app/
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── login/          # Tela de login
│   │   │   ├── cadastro/       # Tela de cadastro
│   │   │   └── estoque/        # Tela principal de estoque
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   └── layout/         # Layout com sidebar
│   │   ├── services/           # Serviços da API
│   │   │   ├── auth.service.ts
│   │   │   ├── produto.service.ts
│   │   │   └── estoque.service.ts
│   │   ├── models/             # Interfaces TypeScript
│   │   ├── guards/             # Guards de autenticação
│   │   ├── config/             # Configurações
│   │   ├── app.routes.ts       # Rotas da aplicação
│   │   └── app.config.ts       # Configuração do Angular
│   ├── styles.scss             # Estilos globais
│   └── index.html              # HTML principal
├── package.json                # Dependências do projeto
└── angular.json                # Configuração do Angular CLI
```

### 🎨 Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|---|---|---|
| Angular | 19+ | Framework frontend |
| TypeScript | - | Linguagem tipada |
| Bootstrap | 5.3 | Framework CSS |
| SCSS | - | Pré-processador CSS |
| RxJS | - | Programação reativa |

### 🔧 Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Linting
npm run lint

# Parar o servidor
Ctrl + C
```

### 🐛 Troubleshooting

**Erro: "Cannot find module '@angular/core'"**
- Solução: Execute `npm install` novamente

**Erro: "Port 4200 is already in use"**
- Solução: Use uma porta diferente com `ng serve --port 4201`

**Erro: "Cannot connect to backend"**
- Verifique se o backend está rodando
- Verifique se a URL em `api.config.ts` está correta
- Verifique se o CORS está habilitado no backend

### 📱 Responsividade

A aplicação foi desenvolvida para ser responsiva e funciona bem em:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

### 📝 Notas Importantes

1. **Autenticação**: Os dados de login são armazenados no `localStorage`
2. **Validações**: Todos os formulários possuem validações básicas
3. **Design**: Paleta de cores minimalista (bege, amarelo claro, branco)
4. **Acessibilidade**: Componentes com labels e ARIA attributes

### 🚀 Próximos Passos

Após confirmar que tudo está funcionando:

1. Implemente as mudanças necessárias no backend (se houver)
2. Teste todas as funcionalidades com dados reais
3. Faça ajustes de design conforme necessário
4. Prepare para deploy

### 📞 Suporte

Se encontrar problemas:
1. Verifique se o backend está rodando
2. Verifique o console do navegador (F12) para erros
3. Verifique os logs do Angular CLI
4. Consulte a documentação do Angular: https://angular.dev

---

**Desenvolvido com ❤️ usando Angular 19 e Bootstrap 5.3**
