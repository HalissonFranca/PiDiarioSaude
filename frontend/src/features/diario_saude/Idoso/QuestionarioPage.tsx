import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Collapse,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { questionarioApi } from "../api/questionarioApi";
import type { Opcao, Pergunta, RespostaDTO } from "../api/types";
import BackButton from "../components/BackButton";

export default function QuestionarioPage() {
  const navigate = useNavigate();

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaDTO[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [refazendo, setRefazendo] = useState(false);

  const respondendoRef = useRef(false);

  const usuario = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("usuario") || "null") ||
        JSON.parse(localStorage.getItem("user") || "null")
      );
    } catch {
      return null;
    }
  })();

  const usuarioId = usuario?.id_usuario ?? usuario?.userId;

  useEffect(() => {
    if (!usuario) navigate("/login");
  }, []);

  // ── Busca respostas já existentes ───────────────────────────
  const {
    data: respostasExistentes,
    isLoading: isLoadingRespostas,
  } = useQuery({
    queryKey: ["questionario", "respostas", usuarioId],
    queryFn: () => questionarioApi.obterRespostas(usuarioId),
    refetchOnWindowFocus: false,
    enabled: !!usuarioId,
  });

  // Só sabemos se o usuário já respondeu após carregar respostas
  const jaRespondeu = !isLoadingRespostas &&
    respostasExistentes !== undefined &&
    respostasExistentes.length > 0;

  // ── Busca perguntas:
  //    - sempre carrega para usuário novo (ainda sem respostas)
  //    - carrega também quando está refazendo
  //    - não carrega enquanto ainda está verificando se já respondeu
  const deveCarregarPerguntas = !!usuarioId &&
    !isLoadingRespostas &&
    (!jaRespondeu || refazendo);

  const {
    data: perguntas,
    isLoading: isLoadingPerguntas,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["questionario", "perguntas"],
    queryFn: questionarioApi.listarPerguntas,
    refetchOnWindowFocus: false,
    enabled: deveCarregarPerguntas,
  });

  const enviarMutation = useMutation({
    mutationFn: (resps: RespostaDTO[]) =>
      questionarioApi.enviarRespostas(usuarioId, resps),
    onSuccess: (retorno) => {
      alert(`Questionário finalizado! Pontuação: ${retorno.pontuacao}`);
      navigate(0); // recarrega para mostrar o resultado atualizado
    },
    onError: (err: any) => {
      respondendoRef.current = false;
      console.error("Erro ao enviar respostas:", err);
      alert("Erro ao enviar respostas. Veja o console.");
    },
  });

  if (!usuario) return null;

  // ── Carregando histórico inicial ────────────────────────────
  if (isLoadingRespostas) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Box display="flex" alignItems="center" gap={2} mt={4}>
          <CircularProgress size={24} />
          <Typography>Carregando seu histórico...</Typography>
        </Box>
      </PageContainer>
    );
  }

  // ── Já respondeu e não está refazendo: mostra resultado ─────
  if (jaRespondeu && !refazendo) {
    const pontuacaoAtual = respostasExistentes!.reduce(
      (acc, r) => acc + (r.peso ?? 0),
      0
    );

    const classificacao = (() => {
      if (pontuacaoAtual <= 3)
        return { label: "Robusto", color: "#2e7d32", descricao: "Sem fragilidade detectada." };
      if (pontuacaoAtual <= 7)
        return { label: "Pré-frágil", color: "#f57c00", descricao: "Atenção recomendada." };
      return { label: "Frágil", color: "#c62828", descricao: "Acompanhamento necessário." };
    })();

    return (
      <PageContainer>
        <BackButton to="/saude" />
        <PageTitle>Questionário de Saúde</PageTitle>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mt: 2, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: classificacao.color, mb: 1 }} />

          <Typography variant="h5" fontWeight={700} mb={1}>
            Questionário já respondido
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="text.secondary" mb={1}>
            Sua pontuação atual
          </Typography>

          <Typography variant="h2" fontWeight={800} sx={{ color: classificacao.color }}>
            {pontuacaoAtual}
          </Typography>

          <Typography variant="h6" fontWeight={600} sx={{ color: classificacao.color, mb: 0.5 }}>
            {classificacao.label}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {classificacao.descricao}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" mb={3}>
            {respostasExistentes!.length} perguntas respondidas
          </Typography>

          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              sx={{ borderRadius: 3, px: 4 }}
              onClick={() => navigate("/saude")}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 4 }}
              onClick={() => {
                setRefazendo(true);
                setIndiceAtual(0);
                setRespostas([]);
                respondendoRef.current = false;
              }}
            >
              Refazer questionário
            </Button>
          </Stack>
        </Paper>
      </PageContainer>
    );
  }

  // ── Carregando perguntas ────────────────────────────────────
  if (isLoadingPerguntas) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Box display="flex" alignItems="center" gap={2} mt={4}>
          <CircularProgress size={24} />
          <Typography>Carregando questionário...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography color="error">Erro ao carregar perguntas.</Typography>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </PageContainer>
    );
  }

  if (!perguntas || perguntas.length === 0) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography>Nenhuma pergunta disponível no questionário.</Typography>
      </PageContainer>
    );
  }

  const perguntaAtual: Pergunta | undefined = perguntas[indiceAtual];

  if (!perguntaAtual) {
    return (
      <PageContainer>
        <Typography>Questionário concluído ou pergunta inválida.</Typography>
      </PageContainer>
    );
  }

  const handleResponder = (opcao: Opcao) => {
    if (respondendoRef.current) return;
    respondendoRef.current = true;

    const nova: RespostaDTO = {
      perguntaId: perguntaAtual.id,
      resposta: opcao.texto,
      peso: opcao.peso,
    };

    const semDuplicata = respostas.filter((r) => r.perguntaId !== perguntaAtual.id);
    const novas = [...semDuplicata, nova];
    setRespostas(novas);

    const ultima = indiceAtual === perguntas.length - 1;
    if (ultima) {
      enviarMutation.mutate(novas);
    } else {
      respondendoRef.current = false;
      setIndiceAtual((n) => n + 1);
    }
  };

  const bloqueado = enviarMutation.isLoading || respondendoRef.current;

  // ── Questionário ────────────────────────────────────────────
  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Questionário de Saúde</PageTitle>

      <SectionTitle>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </SectionTitle>

      <Typography variant="h6" mb={3}>
        {perguntaAtual.texto || "— (pergunta sem texto) —"}
      </Typography>

      {perguntaAtual.opcoes.length === 0 ? (
        <Box>
          <Typography color="text.secondary" mb={2}>
            Esta pergunta não possui opções reconhecíveis pelo cliente.
          </Typography>
          <Button variant="outlined" onClick={() => setShowDebug((s) => !s)}>
            {showDebug ? "Ocultar debug" : "Mostrar debug (opções/objeto)"}
          </Button>
          <Collapse in={showDebug}>
            <Box mt={2} sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 13 }}>
              {JSON.stringify(perguntaAtual, null, 2)}
            </Box>
          </Collapse>
        </Box>
      ) : (
        <Stack spacing={2}>
          {perguntaAtual.opcoes.map((op, idx) => (
            <Button
              key={idx}
              variant="contained"
              fullWidth
              sx={{ borderRadius: 3, py: 2 }}
              onClick={() => handleResponder(op)}
              disabled={bloqueado}
            >
              {op.texto}
            </Button>
          ))}
        </Stack>
      )}

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {respostas.length} respostas registradas
        </Typography>
      </Box>
    </PageContainer>
  );
}