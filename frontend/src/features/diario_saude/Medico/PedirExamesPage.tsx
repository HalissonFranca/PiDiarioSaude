import { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Button, Box,
  Chip, Divider, Stack, TextField, CircularProgress,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegistrarResultadoExamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const prescricao = location.state?.prescricao;
  const paciente = location.state?.paciente;
  const idPrescricao = prescricao?.id_prescricao_medica
    ?? prescricao?.id_prescricao
    ?? prescricao?.id;

  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState<number | null>(null);
  const [resultados, setResultados] = useState<Record<number, { resultado: string; data_realizacao: string }>>({});

  // ✅ controla quais exames estão em modo de edição
  const [editando, setEditando] = useState<Record<number, boolean>>({});

  const medicoLogado = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "null") ||
        JSON.parse(localStorage.getItem("user") || "null");
    } catch { return null; }
  })();

  useEffect(() => {
    if (!idPrescricao) { navigate(-1); return; }
    setLoading(true);
    fetch(`http://localhost:8080/api/diario_saude/prescricao/exame/prescricao/${idPrescricao}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : [];
        setExames(lista);
        const init: Record<number, { resultado: string; data_realizacao: string }> = {};
        lista.forEach((e: any) => {
          init[e.id_prescricao_exame] = {
            resultado: e.resultado ?? "",
            data_realizacao: e.data_realizacao ?? "",
          };
        });
        setResultados(init);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [idPrescricao]);

  const handleSalvarResultado = async (idExame: number) => {
    const dados = resultados[idExame];
    if (!dados?.resultado?.trim()) return alert("Informe o resultado antes de salvar.");
    setSalvando(idExame);
    try {
      const resp = await fetch(
        `http://localhost:8080/api/diario_saude/prescricao/exame/${idExame}/resultado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(dados),
        }
      );
      if (!resp.ok) throw new Error();
      // atualiza o exame na lista e fecha o modo edição
      setExames(prev => prev.map(e =>
        e.id_prescricao_exame === idExame
          ? { ...e, resultado: dados.resultado, data_realizacao: dados.data_realizacao }
          : e
      ));
      setEditando(prev => ({ ...prev, [idExame]: false }));
      alert("Resultado salvo!");
    } catch {
      alert("Erro ao salvar resultado.");
    } finally {
      setSalvando(null);
    }
  };

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, borderTop: "4px solid #1565c0" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1.5}>
            <LocalHospitalIcon sx={{ fontSize: 36, color: "#1565c0" }} />
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1565c0">
                RESULTADO DE EXAMES
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plataforma UNATI — Diário da Saúde
              </Typography>
            </Box>
          </Box>
          <Button onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>Voltar</Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3, p: 2, bgcolor: "#f0f4ff", borderRadius: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Paciente</Typography>
            <Typography fontWeight={700} fontSize="1rem">{paciente?.nome ?? "—"}</Typography>
            {paciente?.idade > 0 && (
              <Typography variant="body2" color="text.secondary">{paciente.idade} anos</Typography>
            )}
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Médico Responsável</Typography>
            <Typography fontWeight={700} fontSize="1rem">
              {medicoLogado?.name ?? medicoLogado?.nome ?? "Médico"}
            </Typography>
            <Typography variant="body2" color="text.secondary">{dataHoje}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScienceIcon sx={{ color: "#1565c0" }} />
            <Typography variant="h6" fontWeight={600}>Exames Solicitados</Typography>
          </Box>
          <Chip label={`${exames.length} exame(s)`} size="small" color="primary" variant="outlined" />
        </Box>

        {loading && <CircularProgress />}

        {!loading && exames.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: 2, border: "1px dashed #ccc" }}>
            <ScienceIcon sx={{ fontSize: 40, color: "#ccc", mb: 1 }} />
            <Typography color="text.secondary">Nenhum exame solicitado nesta prescrição.</Typography>
          </Box>
        )}

        <Stack spacing={2}>
          {exames.map((exame: any) => {
            const id = exame.id_prescricao_exame;
            const jaTemResultado = !!exame.resultado;
            const modoEdicao = editando[id] || !jaTemResultado;

            return (
              <Paper
                key={id}
                elevation={0}
                sx={{
                  p: 2.5, borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  borderLeft: `4px solid ${jaTemResultado ? "#2e7d32" : "#1565c0"}`,
                }}
              >
                {/* Cabeçalho do exame */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScienceIcon fontSize="small" color="primary" />
                    <Typography fontWeight={700}>
                      {exame.exame?.nome_exame ?? "Exame"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {jaTemResultado && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Resultado registrado"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    {/* ✅ botão editar aparece só quando já tem resultado */}
                    {jaTemResultado && !editando[id] && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditando(prev => ({ ...prev, [id]: true }))}
                        sx={{ textTransform: "none" }}
                      >
                        Editar
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* ✅ modo somente leitura */}
                {jaTemResultado && !modoEdicao ? (
                  <Box sx={{ p: 2, bgcolor: "#f9fbe7", borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      <strong>Resultado:</strong>
                    </Typography>
                    <Typography mb={1}>{exame.resultado}</Typography>
                    {exame.data_realizacao && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Data de realização:</strong>{" "}
                        {new Date(exame.data_realizacao).toLocaleDateString("pt-BR")}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  // ✅ modo edição
                  <Stack spacing={1.5}>
                    <TextField
                      label="Resultado"
                      fullWidth
                      multiline
                      minRows={2}
                      value={resultados[id]?.resultado ?? ""}
                      onChange={e => setResultados(prev => ({
                        ...prev,
                        [id]: { ...prev[id], resultado: e.target.value }
                      }))}
                      placeholder="Descreva o resultado do exame..."
                    />
                    <TextField
                      label="Data de realização"
                      type="date"
                      fullWidth
                      value={resultados[id]?.data_realizacao ?? ""}
                      onChange={e => setResultados(prev => ({
                        ...prev,
                        [id]: { ...prev[id], data_realizacao: e.target.value }
                      }))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      {jaTemResultado && (
                        <Button
                          variant="outlined"
                          onClick={() => setEditando(prev => ({ ...prev, [id]: false }))}
                          sx={{ borderRadius: 2 }}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={() => handleSalvarResultado(id)}
                        disabled={salvando === id}
                        sx={{ borderRadius: 2 }}
                      >
                        {salvando === id ? "Salvando..." : "Salvar resultado"}
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Paper>
    </Container>
  );
}