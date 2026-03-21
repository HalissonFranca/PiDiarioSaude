<<<<<<< HEAD
=======
<<<<<<< HEAD
import { useState } from "react";
import { Box, Button, Typography, Stack, LinearProgress } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { questionarioApi } from "../api/questionarioApi";
import type { Opcao, Pergunta, RespostaDTO } from "../api/types";

function classificarRisco(pontuacao: number): { label: string; cor: string } {
  if (pontuacao <= 6) return { label: "Baixo risco de fragilidade", cor: "#2e7d32" };
  if (pontuacao <= 14) return { label: "Moderado risco de fragilidade", cor: "#f57c00" };
  return { label: "Alto risco de fragilidade", cor: "#c62828" };
}
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
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
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

export default function QuestionarioPage() {
  const navigate = useNavigate();

<<<<<<< HEAD
=======
<<<<<<< HEAD
  // ⚠️ Verifique qual chave seu app usa: "user" ou "usuario"
  const usuario = JSON.parse(localStorage.getItem("user") || "null");
  const roleCode = usuario?.roleCode || "";

  // Proteção de acesso
  if (!usuario) {
    navigate("/", { replace: true });
    return null;
  }

  if (roleCode !== "IDOSO") {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Box sx={{ mt: 6, textAlign: "center", p: 4, borderRadius: 3, border: "2px solid #c62828" }}>
          <Typography variant="h5" fontWeight="bold" color="error" mb={2}>
            Acesso não autorizado
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Esta página é exclusiva para pacientes idosos.
          </Typography>
          <Button variant="contained" color="error" onClick={() => navigate("/home")}>
            Voltar ao início
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaDTO[]>([]);
  const [resultado, setResultado] = useState<{ pontuacao: number } | null>(null);

  // Busca perguntas da API
  const { data: perguntas, isLoading, isError, refetch } = useQuery({
    queryKey: ["questionario", "perguntas"],
    queryFn: questionarioApi.listarPerguntas,
    refetchOnWindowFocus: false,
  });

  // Envia respostas para o backend
  const enviarMutation = useMutation({
    mutationFn: (resps: RespostaDTO[]) =>
      questionarioApi.enviarRespostas(usuario.userId, resps),
    onSuccess: (retorno) => {
      setResultado({ pontuacao: retorno.pontuacao });
    },
    onError: (err: any) => {
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
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
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
      console.error("Erro ao enviar respostas:", err);
      alert("Erro ao enviar respostas. Veja o console.");
    },
  });

<<<<<<< HEAD
=======
<<<<<<< HEAD
  if (isLoading) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography>Carregando questionário...</Typography>
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
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
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
<<<<<<< HEAD
        <Typography color="error">Erro ao carregar perguntas.</Typography>
=======
<<<<<<< HEAD
        <Typography color="error" mb={2}>Erro ao carregar perguntas.</Typography>
=======
        <Typography color="error">Erro ao carregar perguntas.</Typography>
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
  // Tela de resultado
  if (resultado) {
    const { label, cor } = classificarRisco(resultado.pontuacao);
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <PageTitle>Resultado do Questionário</PageTitle>
        <Box sx={{ mt: 4, p: 4, borderRadius: 3, border: `2px solid ${cor}`, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: cor }} mb={2}>
            Pontuação: {resultado.pontuacao}
          </Typography>
          <Typography variant="h6" sx={{ color: cor }} mb={4}>
            {label}
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/saude")} sx={{ borderRadius: 2 }}>
            Voltar
          </Button>
        </Box>
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
  const perguntaAtual: Pergunta | undefined = perguntas[indiceAtual];

  if (!perguntaAtual) {
    return (
      <PageContainer>
        <Typography>Questionário concluído ou pergunta inválida.</Typography>
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
      </PageContainer>
    );
  }

<<<<<<< HEAD
=======
<<<<<<< HEAD
  const perguntaAtual: Pergunta = perguntas[indiceAtual];
  const progresso = (indiceAtual / perguntas.length) * 100;

  const handleResponder = (opcao: Opcao) => {
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
  const handleResponder = (opcao: Opcao) => {
    if (respondendoRef.current) return;
    respondendoRef.current = true;

<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    const nova: RespostaDTO = {
      perguntaId: perguntaAtual.id,
      resposta: opcao.texto,
      peso: opcao.peso,
    };

<<<<<<< HEAD
=======
<<<<<<< HEAD
    const novas = [...respostas, nova];
    setRespostas(novas);

    if (indiceAtual === perguntas.length - 1) {
      // Última pergunta — envia para o backend
      enviarMutation.mutate(novas);
    } else {
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    const semDuplicata = respostas.filter((r) => r.perguntaId !== perguntaAtual.id);
    const novas = [...semDuplicata, nova];
    setRespostas(novas);

    const ultima = indiceAtual === perguntas.length - 1;
    if (ultima) {
      enviarMutation.mutate(novas);
    } else {
      respondendoRef.current = false;
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
      setIndiceAtual((n) => n + 1);
    }
  };

<<<<<<< HEAD
  const bloqueado = enviarMutation.isLoading || respondendoRef.current;

  // ── Questionário ────────────────────────────────────────────
=======
<<<<<<< HEAD
=======
  const bloqueado = enviarMutation.isLoading || respondendoRef.current;

  // ── Questionário ────────────────────────────────────────────
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Questionário de Saúde</PageTitle>

<<<<<<< HEAD
=======
<<<<<<< HEAD
      {/* Progresso */}
      <Box mb={3}>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Pergunta {indiceAtual + 1} de {perguntas.length}
        </Typography>
        <LinearProgress variant="determinate" value={progresso} sx={{ height: 8, borderRadius: 4 }} />
      </Box>

      {/* Pergunta */}
      <Typography variant="h6" mb={4} sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
        {perguntaAtual.texto}
      </Typography>

      {/* Opções */}
      <Stack spacing={2}>
        {perguntaAtual.opcoes.map((op, idx) => (
          <Button
            key={idx}
            variant="outlined"
            fullWidth
            onClick={() => handleResponder(op)}
            disabled={enviarMutation.isLoading}
            sx={{
              borderRadius: 3,
              py: 2,
              textAlign: "left",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "0.95rem",
            }}
          >
            {op.texto}
          </Button>
        ))}
      </Stack>

      {enviarMutation.isLoading && (
        <Typography mt={3} textAlign="center" color="text.secondary">
          Salvando respostas...
        </Typography>
      )}
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
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
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    </PageContainer>
  );
}