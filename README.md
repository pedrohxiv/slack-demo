# Projeto Demo Slack

## Descrição do Projeto

Este projeto é um clone do Slack, desenvolvido para demonstrar um sistema de comunicação em tempo real completo e escalável. Inclui funcionalidades essenciais para colaboração entre equipes, como criação de workspaces, canais, mensagens diretas, threads, reações e controle de acesso por papéis. O projeto é construído com Next.js 14, Tailwind CSS e Shadcn UI, e está totalmente integrado para autenticação, controle de permissões e interatividade em tempo real.

## Principais Funcionalidades

- **Comunicação em Tempo Real:** Mensagens instantâneas em canais, threads ou conversas diretas.

- **Reações a Mensagens:** Adicione emojis para reagir às mensagens.

- **Threads e Respostas:** Organize discussões em threads dentro dos canais.

- **Edição de Mensagens:** Edite mensagens já enviadas.

- **Exclusão de Mensagens:** Permita aos usuários excluir mensagens.

- **Controle Baseado em Papéis:** Gerencie permissões de membros com base em funções atribuídas.

- **Anexos de Imagens:** Compartilhe imagens diretamente nas conversas.

- **Autenticação Segura:** Autenticação robusta utilizando NextAuth v5.

- **Criação de Canais:** Crie canais para conversas organizadas.

- **Criação de Workspaces:** Crie e gerencie workspaces com facilidade.

- **Sistema de Convites:** Convide membros utilizando códigos ou e-mails.

- **Mensagens Diretas:** Converse diretamente com outros usuários.

- **Perfis de Usuários:** Visualize e edite perfis dos membros.

- **Framework Moderno:** Desenvolvido com Next.js 14, aproveitando suas novas funcionalidades.

- **UI Responsiva e Moderna:** Utiliza Tailwind CSS e Shadcn UI para uma experiência de usuário consistente e responsiva.

## Dependências

O projeto utiliza diversas dependências para garantir seu funcionamento suave:

- `@auth/core`: ^0.35.3,
- `@convex-dev/auth`: ^0.0.71,
- `@radix-ui/react-avatar`: ^1.1.1,
- `@radix-ui/react-dialog`: ^1.1.2,
- `@radix-ui/react-dropdown-menu`: ^2.1.2,
- `@radix-ui/react-popover`: ^1.1.2,
- `@radix-ui/react-separator`: ^1.1.0,
- `@radix-ui/react-slot`: ^1.1.0,
- `@radix-ui/react-toast`: ^1.2.2,
- `@radix-ui/react-tooltip`: ^1.1.3,
- `class-variance-authority`: ^0.7.0,
- `clsx`: ^2.1.1,
- `cmdk`: ^1.0.0,
- `convex`: ^1.16.3,
- `date-fns`: ^4.1.0,
- `emoji-picker-react`: ^4.12.0,
- `input-otp`: ^1.2.4,
- `jotai`: ^2.10.0,
- `lucide-react`: ^0.446.0,
- `next`: 14.2.13,
- `nuqs`: ^2.2.1,
- `quill`: ^2.0.2,
- `react`: ^18,
- `react-dom`: ^18,
- `react-resizable-panels`: ^2.1.4,
- `tailwind-merge`: ^2.5.2,
- `tailwindcss-animate`: ^1.0.7,
- `@types/node`: ^20,
- `@types/react`: ^18,
- `@types/react-dom`: ^18,
- `postcss`: ^8,
- `tailwindcss`: ^3.4.1,
- `typescript`: ^5

## Como Executar o Projeto

1. Clone este repositório em sua máquina local.
2. Certifique-se de ter o Node.js e o npm (ou yarn) instalados.
3. Instale as dependências do projeto utilizando o seguinte comando:

```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves e seus respectivos valores:

```env
CONVEX_DEPLOYMENT=seu_valor_aqui
NEXT_PUBLIC_CONVEX_URL=seu_valor_aqui
```

Certifique-se de substituir `seu_valor_aqui` pelos valores corretos de cada chave.

5. Inicie o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

6. Acesse a aplicação em `http://localhost:3000` e explore as funcionalidades completas do Slack Demo e adapte-as conforme suas necessidades específicas.
