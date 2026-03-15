# Story-001: Refatoração do Monólito NEUROEXTUB

## Status: Em Planejamento

## Descrição
Como desenvolvedor do projeto, quero migrar o código base atual (um único arquivo JSX com estilos inline) para uma arquitetura modular React (Vite + TypeScript + CSS Modules) seguindo o framework AIOX, para garantir manutenibilidade, testabilidade e performance.

## Critérios de Aceite
1.  **Modularização:** O código deve ser dividido em pequenos componentes funcionais em `src/components/`.
2.  **Lógica Isolada:** Toda a lógica de pontuação (scoring) deve residir em um hook customizado (`useScoresCalculations.ts`) ou utilitário.
3.  **Tipagem Forte:** Deve ser utilizado TypeScript para garantir a integridade dos dados médicos.
4.  **Estilização Profissional:** Substituir estilos inline por CSS Modules ou Tailwind, mantendo a identidade visual "Premium Dark".
5.  **Testes:** A lógica de cálculo deve ser coberta por testes unitários passantes.
6.  **Build:** O projeto deve gerar um artefato estático (pasta `dist/`) pronto para upload na Hostinger.

## Lista de Arquivos (Proposta)
- `src/App.tsx`: Orquestrador principal.
- `src/components/PhaseNavigation.tsx`: Barra de progresso e navegação.
- `src/components/PatientForm.tsx`: Dados de identificação.
- `src/components/Checklist.tsx`: Pré-requisitos.
- `src/components/ScorePanel.tsx`: Exibição visual dos scores.
- `src/hooks/useScoresCalculations.ts`: Lógica centralizada.
- `src/utils/reportGenerator.ts`: Geração de HTML para PDF.
- `src/utils/scoring.test.ts`: Suíte de testes.

## Definição de Pronto (DoD)
- Build concluído com sucesso.
- Todos os testes unitários passando.
- Documentação de deploy (`DEPLOY.md`) criada.
