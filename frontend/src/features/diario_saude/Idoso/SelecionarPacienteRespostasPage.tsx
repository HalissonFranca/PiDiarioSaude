import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import BackButton from "../components/BackButton";

const usuarioApi = {
  listar: async (): Promise<any[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get("/api/diario_saude/usuario", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  },
};

export default function SelecionarPacienteRespostasPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);

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

  // ✅ Só admin acessa essa página
  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }
    if (role !== "ROLE_ADMIN") {
      navigate("/home");
    }
  }, []);

  const token = localStorage.getItem("token");

  const { data: pacientes = [], isLoading, isError } = useQuery({
    queryKey: ["pacientes"],
    queryFn: usuarioApi.listar,
    enabled: !!token,
  });

  const filtered = pacientes.filter((p) =>
    p.nome?.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerRespostas = () => {
    if (!selectedPaciente) return;
    // ✅ Navega para RespostasPage passando o paciente via state
    navigate("/respostas_questionario", { state: { paciente: selectedPaciente } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <BackButton to="/saude" />
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={1} textAlign="center" fontWeight={700}>
          Respostas do Questionário
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Selecione um paciente para ver suas respostas
        </Typography>

        <TextField
          fullWidth
          label="Buscar paciente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {isLoading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={24} />
          </Box>
        )}

        {isError && (
          <Typography color="error" mb={2}>
            Erro ao carregar pacientes.
          </Typography>
        )}

        <List sx={{ maxHeight: 320, overflowY: "auto" }}>
          {filtered.map((p) => (
            <ListItemButton
              key={p.id_usuario}
              selected={selectedPaciente?.id_usuario === p.id_usuario}
              onClick={() => setSelectedPaciente(p)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText
                primary={p.nome}
                secondary={`ID: ${p.id_usuario}`}
              />
            </ListItemButton>
          ))}
          {!isLoading && filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              Nenhum paciente encontrado.
            </Typography>
          )}
        </List>

        <Box mt={3}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!selectedPaciente}
            onClick={handleVerRespostas}
            sx={{ borderRadius: 3 }}
          >
            Ver Respostas
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
