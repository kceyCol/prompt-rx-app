export const FRAMEWORKS: Record<string, {
    id: string;
    name: string;
    acronym: string;
    description: string;
    bestFor: string[];
}> = {
    CID: {
        id: 'CID',
        name: 'Método C-I-D',
        acronym: 'Contexto · Instrução · Dados',
        description: 'Framework geral e versátil. Ideal para a maioria das tarefas clínicas do dia a dia.',
        bestFor: ['documentation', 'pharmacology'],
    },
    RACE: {
        id: 'RACE',
        name: 'RACE',
        acronym: 'Role · Action · Context · Expectation',
        description: 'Melhor para comunicação e documentação formal. Foca em qualidade de entrega.',
        bestFor: ['communication', 'documentation'],
    },
    TRACE: {
        id: 'TRACE',
        name: 'TRACE',
        acronym: 'Task · Request · Action · Context · Example',
        description: 'Excelente para revisões estruturadas, relatórios de pesquisa ou sumários grandes.',
        bestFor: ['research'],
    },
    ERA: {
        id: 'ERA',
        name: 'ERA',
        acronym: 'Expectation · Role · Action',
        description: 'Ideal para elaboração rápida de protocolos ou requisições diretas onde o papel é fundamental.',
        bestFor: ['management', 'protocols'],
    },
    APE: {
        id: 'APE',
        name: 'APE',
        acronym: 'Action · Purpose · Expectation',
        description: 'Focado em ações afirmativas com um propósito claro, ideal para orientar pacientes.',
        bestFor: ['communication'],
    },
    TAE: {
        id: 'TAE',
        name: 'TAE',
        acronym: 'Task · Action · Goal',
        description: 'Modelo enxuto focado em objetivos curtos e diretos, perfeito para atualizações científicas.',
        bestFor: ['research', 'education'],
    },
    CARE: {
        id: 'CARE',
        name: 'CARE',
        acronym: 'Context · Action · Result · Example',
        description: 'Focado na segurança do paciente, evidenciando o caso e exigindo exemplos baseados em evidências.',
        bestFor: ['pharmacology', 'safety'],
    },
    RISE: {
        id: 'RISE',
        name: 'RISE',
        acronym: 'Role · Input · Steps · Expectation',
        description: 'Framework focado no ensino e estruturação de aulas para residentes ou profissionais.',
        bestFor: ['education', 'clinical_decision'],
    },
    ROSES: {
        id: 'ROSES',
        name: 'ROSES',
        acronym: 'Role · Objective · Scenario · Expected · Steps',
        description: 'Muito detalhado para gestão em saúde, fluxos de triagem e mapeamento de processos clínicos.',
        bestFor: ['management'],
    },
    COAST: {
        id: 'COAST',
        name: 'COAST',
        acronym: 'Context · Objective · Actions · Scenario · Task',
        description: 'Útil no planejamento de eventos ou coordenação de casos complexos multidisciplinares.',
        bestFor: ['education', 'events'],
    },
    COT: {
        id: 'COT',
        name: 'Chain-of-Thought',
        acronym: 'Raciocínio Passo a Passo',
        description: 'Força a IA a detalhar o porquê de cada decisão clínica. Reduz significativamente erros de diagnóstico.',
        bestFor: ['clinical_decision'],
    },
    MEGA: {
        id: 'MEGA',
        name: 'MEGA',
        acronym: 'Macros · Environment · Goal · Action',
        description: 'Focado na criação de bots de triagem, fluxos no WhatsApp e automações de saúde.',
        bestFor: ['automation'],
    }
}
