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

export default function QuestionarioPage() {
  const navigate = useNavigate();

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
      console.error("Erro ao enviar respostas:", err);
      alert("Erro ao enviar respostas. Veja o console.");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography>Carregando questionário...</Typography>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography color="error" mb={2}>Erro ao carregar perguntas.</Typography>
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
      </PageContainer>
    );
  }

  const perguntaAtual: Pergunta = perguntas[indiceAtual];
  const progresso = (indiceAtual / perguntas.length) * 100;

  const handleResponder = (opcao: Opcao) => {
    const nova: RespostaDTO = {
      perguntaId: perguntaAtual.id,
      resposta: opcao.texto,
      peso: opcao.peso,
    };

    const novas = [...respostas, nova];
    setRespostas(novas);

    if (indiceAtual === perguntas.length - 1) {
      // Última pergunta — envia para o backend
      enviarMutation.mutate(novas);
    } else {
      setIndiceAtual((n) => n + 1);
    }
  };

  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Questionário de Saúde</PageTitle>

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
    </PageContainer>
  );
}