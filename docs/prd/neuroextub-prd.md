# PRD - NEUROEXTUB (Protocolo de Extubação Neurocrítica)

## 1. Visão Geral
O **NEUROEXTUB** é uma ferramenta de apoio à decisão clínica (CDSS) projetada para auxiliar médicos intensivistas, fisioterapeutas e enfermeiros na avaliação da prontidão para extubação em pacientes neurocríticos. A ferramenta consolida múltiplos scores validados e evidências científicas recentes em um fluxo de trabalho estruturado.

## 2. Personas
- **Médico Intensivista:** Toma a decisão final de extubação baseada nos scores e julgamento clínico.
- **Fisioterapeuta Respiratório:** Realiza o TRE (Teste de Respiração Espontânea) e avalia parâmetros respiratórios.
- **Equipe de Enfermagem:** Monitora parâmetros vitais e estabilidade do paciente.

## 3. Escopo Funcional

### 3.1. Avaliação Multidimensional
- **Identificação do Paciente:** Nome, leito, idade, peso, diagnóstico, dias de VM, diâmetro do TOT.
- **Pré-requisitos:** Checklist de 8 itens obrigatórios (estabilidade da lesão, PIC, sedação, hemodinâmica, etc.).
- **Avaliação Neurológica:** FOUR Score, GCS, VISAGE Score, pupilas, RASS, monitorização de PIC/PPC.
- **Avaliação Respiratória:** PaO2/FiO2, PEEP, FiO2, RSBI, PImax, CV, secreções e Teste de Respiração Espontânea (TRE).
- **Proteção de Via Aérea (STAGE Score):** Deglutição, protrusão lingual, tosse (espontânea e provocada), gag reflex, acúmulo salivar.
- **Hemodinâmica:** PA, FC, temperatura, PCR, eletrólitos, gasometria e uso de vasopressores.
- **Cuff Leak Test:** Volume de escape e conduta baseada em evidência (Francois 2007).

### 3.2. Lógica de Decisão (Coração do App)
A aplicação deve processar os dados inseridos e retornar uma das seguintes recomendações:
- **EXTUBAÇÃO RECOMENDADA:** VISAGE ≥ 6, FOUR ≥ 12, STAGE ≥ 6 e TRE Sucesso.
- **EXTUBAÇÃO CONDICIONAL:** VISAGE ≥ 4, FOUR ≥ 10 e TRE Sucesso.
- **ADIAR EXTUBAÇÃO:** VISAGE < 4 ou FOUR < 10.
- **PRÉ-REQUISITOS PENDENTES:** Se o checklist inicial não estiver 100% completo.
- **FALHA NO TRE:** Se o teste de respiração espontânea falhou.

### 3.3. Classificação de Risco
O risco pós-extubação é calculado com base em fatores como idade, dias de VM, tosse, deglutição, etc.
- **Baixo:** ≤ 2 fatores.
- **Médio:** ≤ 4 fatores.
- **Alto:** > 4 fatores.

### 3.4. Relatório e Documentação
- Geração de relatório clínico em HTML/PDF para registro em prontuário.
- Inclusão obrigatória de Termo de Responsabilidade (Disclaimer).
- Bibliografia e justificativa baseada em evidências para cada score.

## 4. Requisitos Não Funcionais
- **Hospedagem:** Hostinger (Arquivos Estáticos).
- **Performance:** Carregamento instantâneo, funcionamento offline (PWA opcional no futuro).
- **UX/UI:** Design premium, dark mode, responsivo para tablets e smartphones à beira do leito.
- **Segurança:** Sem armazenamento persistente de dados de pacientes no servidor (client-side only).

## 5. Critérios de Aceite
- Cálculos matemáticos dos scores devem ser 100% precisos (verificados por testes unitários).
- O fluxo de navegação entre as 10 fases deve ser intuitivo.
- A função de impressão deve gerar um PDF formatado e profissional.
