# NEUROEXTUB v2.0 🏥

> Protocolo Inteligente de Desmame e Extubação em Pacientes Neurocríticos.

NEUROEXTUB é uma ferramenta clínica avançada projetada para auxiliar equipes de UTI na tomada de decisão segura para a extubação de pacientes com lesões neurológicas. Baseado em evidências científicas atualizadas (2000-2026), o sistema integra múltiplos scores e parâmetros fisiológicos em uma interface intuitiva e responsiva.

![Relatório NEUROEXTUB](docs/screenshots/neuroextub_results_1773601956350.png)

## 🚀 Principais Funcionalidades

- **Cálculo Integrado de Scores**:
  - **FOUR Score**: Avaliação detalhada do nível de consciência.
  - **VISAGE**: Preditor específico para sucesso de extubação em neurocríticos.
  - **STAGE**: Avaliação multidimensional das vias aéreas.
  - **BIPER**: Score de prontidão para o desmame.
  - **GCS**: Escala de Coma de Glasgow automatizada.
- **Algoritmo de Decisão**: Recomendação dinâmica (Recomendada, Condicional, Diferir) baseada no cruzamento de dados clínicos.
- **Relatório Clínico**: Geração de relatório em HTML/PDF para documentação no prontuário.
- **Design Premium**: Interface escura (Dark Mode) otimizada para ambientes de alta luminosidade, compatível com Mobile e Tablet.

## 🛠️ Tecnologias Utilizadas

- **Core**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules (Arquitetura AIOX)
- **Testing**: Vitest (100% de cobertura lógica)
- **Deployment**: Pronto para hospedagem estática (Vercel/Hostinger)

## 📦 Estrutura do Projeto

```text
src/
├── components/     # Componentes modulares (UI e Painéis)
├── constants/      # Dados médicos e evidências científicas
├── hooks/          # Lógica de cálculo (useScoresCalculations)
├── utils/          # Geradores de relatório e lógica pura
└── assets/         # Recursos estáticos
```

## 🛠️ Instalação e Desenvolvimento

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Execute os testes unitários:
```bash
npm test
```

4. Gere o build de produção:
```bash
npm run build
```

## ⚖️ Isenção de Responsabilidade

Esta ferramenta é um suporte à decisão clínica e não substitui o julgamento profissional. Recomenda-se a avaliação multiprofissional (Médico, Fisioterapeuta e Enfermeiro) conforme evidências citadas no manual do protocolo.

---
**Desenvolvido por Dr. Jackson Erasmo Fuck**
SAMUTI · UNIPAR
