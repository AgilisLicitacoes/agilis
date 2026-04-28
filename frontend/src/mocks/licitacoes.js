export const licitacoesMock = [
  {
    id: "900062025",
    title: "Pregão Eletrônico N° 90006/2025 (SRP)",
    emissor: "Hospital Geral de Juiz de Fora",
    uasg: "160121",
    publishedAt: "12 Out 2023",
    status: { label: "Extração Concluída", tone: "success" },
  },
  {
    id: "901042025",
    title: "Pregão Eletrônico N° 90104/2025 (SRP)",
    emissor: "Prefeitura Municipal de Duque de Caxias - RJ",
    uasg: "985833",
    publishedAt: "10 Out 2023",
    status: { label: "Processando Edital", tone: "warning" },
  },
  {
    id: "908222025",
    title: "Pregão Eletrônico N° 90822/2025 (SRP)",
    emissor: "Hospital das Clínicas de São Paulo",
    uasg: "92301",
    publishedAt: "08 Out 2023",
    status: { label: "Extração Concluída", tone: "success" },
  },
  {
    id: "3342025",
    title: "Aviso de Contratação Direta nº 334/2025",
    emissor: "Fundo Estadual de Saúde de Rondônia",
    uasg: "927502",
    publishedAt: "05 Out 2023",
    status: { label: "Aguardando Início", tone: "neutral" },
  },
  {
    id: "900182025",
    title: "Pregão Eletrônico N° 90018/2025 (SRP)",
    emissor: "Hospital Geral de Salvador",
    uasg: "160039",
    publishedAt: "03 Out 2023",
    status: { label: "Extração Concluída", tone: "success" },
  },
];

export function getLicitacaoById(id) {
  return licitacoesMock.find((x) => x.id === id) ?? null;
}

