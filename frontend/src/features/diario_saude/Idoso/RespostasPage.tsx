import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Stack, Paper, Divider, Chip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import BackButton from "../components/BackButton";

import { questionarioApi } from "../api/questionarioApi";

export default function RespostasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLogado = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("usuario") || "null") ||
        JSON.parse(localStorage.getItem("user") || "null")
      );
    } catch {
      return null;
    }
  })();

  const role = usuarioLogado?.roleName ?? usuarioLogado?.role ?? "";

  // ✅ Médico recebe o paciente via navigation state (vindo do dashboard)
  // ✅ Cuidador/Admin vê as respostas do próprio usuário logado
  const isMedico = role === "ROLE_MEDICO";
  const isCuidadorOuAdmin = role === "ROLE_CUIDADOR" || role === "ROLE_ADMIN";

  const pacienteViaMedico = location.state?.paciente;

  // Para cuidador/admin, o "paciente" é o próprio usuário logado
  const paciente = isMedico
    ? pacienteViaMedico
    : isCuidadorOuAdmin
      ? { id_usuario: usuarioLogado?.id_usuario ?? usuarioLogado?.userId, nome: usuarioLogado?.name ?? usuarioLogado?.nome }
      : null;

  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }
    // ✅ Idoso não acessa — só médico, cuidador e admin
    if (!isMedico && !isCuidadorOuAdmin) {
      navigate("/home");
      return;
    }
    // ✅ Médico sem paciente selecionado vai para seleção
    if (isMedico && !pacienteViaMedico) {
      navigate("/medico");
    }
  }, []);

  const pacienteId = paciente?.id_usuario;

  const {
    data: respostas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["questionario", "respostas", pacienteId],
    queryFn: () => questionarioApi.obterRespostas(pacienteId),
    refetchOnWindowFocus: false,
    enabled: !!pacienteId,
  });

  if (!usuarioLogado || !paciente) return null;

  // ✅ Destino do botão voltar depende do role
  const backTo = isMedico ? "/atendimento/dashboard" : "/saude";

  if (isLoading) {
    return (
      <PageContainer>
        <BackButton to={backTo} />
        <Typography>Carregando respostas...</Typography>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to={backTo} />
        <Typography color="error">Erro ao carregar respostas.</Typography>
        <Typography
          sx={{ cursor: "pointer", textDecoration: "underline", mt: 1 }}
          onClick={() => refetch()}
        >
          Tentar novamente
        </Typography>
      </PageContainer>
    );
  }

  if (respostas.length === 0) {
    return (
      <PageContainer>
        <BackButton to={backTo} />
        <PageTitle>Questionário de Saúde</PageTitle>
        <Typography color="text.secondary">
          {isMedico
            ? <>O paciente <strong>{paciente.nome}</strong> ainda não respondeu o questionário.</>
            : "Nenhuma resposta registrada ainda."}
        </Typography>
      </PageContainer>
    );
  }

  const respostasOrdenadas = respostas.slice().sort((a, b) => a.perguntaId - b.perguntaId);
  const pontuacaoTotal = respostasOrdenadas.reduce((acc, r) => acc + r.peso, 0);

  const classificacao = (() => {
    if (pontuacaoTotal <= 6)
      return { label: "Robusto", color: "#2e7d32", descricao: "Baixa vulnerabilidade clinico-funcional." };
    if (pontuacaoTotal <= 14)
      return { label: "Em risco", color: "#f57c00", descricao: "Vulnerabilidade leve — atencao recomendada." };
    if (pontuacaoTotal <= 20)
      return { label: "Moderadamente fragil", color: "#e65100", descricao: "Vulnerabilidade moderada." };
    return { label: "Altamente fragil", color: "#c62828", descricao: "Alta vulnerabilidade clinico-funcional." };
  })();

  return (
    <PageContainer>
      <BackButton to={backTo} />
      <PageTitle>Questionário de Saúde</PageTitle>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        {/* Só mostra nome do paciente para médico */}
        {isMedico && (
          <>
            <Typography variant="subtitle1" color="text.secondary" mb={1}>
              Paciente
            </Typography>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {paciente.nome}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        <Typography variant="subtitle1" color="text.secondary" mb={1}>
          Pontuação total
        </Typography>
        <Typography variant="h3" fontWeight={800} sx={{ color: classificacao.color }}>
          {pontuacaoTotal}
        </Typography>
        <Chip
          label={classificacao.label}
          sx={{
            mt: 1, mb: 0.5,
            bgcolor: classificacao.color,
            color: "white",
            fontWeight: 700,
            fontSize: 14,
          }}
        />
        <Typography variant="body2" color="text.secondary" mt={1}>
          {classificacao.descricao}
        </Typography>
      </Paper>

      <SectionTitle>Respostas ({respostasOrdenadas.length} perguntas)</SectionTitle>

      <Stack spacing={2} mt={2}>
        {respostasOrdenadas.map((r: any, idx) => (
          <Paper
            key={r.perguntaId}
            elevation={1}
            sx={{ p: 2.5, borderRadius: 2, borderLeft: `4px solid ${r.peso > 0 ? "#f57c00" : "#2e7d32"}` }}
          >
            <Typography variant="caption" color="text.secondary">
              Pergunta {idx + 1}
            </Typography>
            <Typography fontWeight={600} mb={1}>
              {r.perguntaTexto ?? r.pergunta?.texto ?? "—"}
            </Typography>
            <Typography mb={0.5}>
              <strong>Resposta:</strong> {r.resposta}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Peso:</strong> {r.peso}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </PageContainer>
  );
}