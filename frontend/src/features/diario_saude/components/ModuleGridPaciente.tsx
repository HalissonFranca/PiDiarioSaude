import { Box } from '@mui/material';
import { ModuleCard } from '../../../components/ModuleCard';
import HistoryIcon from '@mui/icons-material/History';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';

export function ModuleGridSaude() {
  const navigate = useNavigate();

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

  const role = usuario?.roleName ?? usuario?.role ?? "";
  const isIdoso = role === "ROLE_IDOSO";
  const isCuidador = role === "ROLE_CUIDADOR";
  const isAdmin = role === "ROLE_ADMIN";
  const isIdosoOuCuidador = isIdoso || isCuidador;

  const items = [
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} color="primary" />,
      title: 'Histórico de Consultas',
      desc: 'Veja consultas anteriores.',
      onClick: () => navigate('/historico_consultas'),
      visivel: true,
    },
    {
      icon: <CoronavirusIcon sx={{ fontSize: 40 }} color="info" />,
      title: 'Informações de Saúde',
      desc: 'Doenças cadastradas do paciente.',
      onClick: () => navigate('/informacoes_saude'),
      visivel: true,
    },
    {
      // ✅ Só idoso e cuidador respondem o questionário
      icon: <CoronavirusIcon sx={{ fontSize: 40 }} color="success" />,
      title: 'Questionário de Saúde',
      desc: 'Responda o questionário de avaliação.',
      onClick: () => navigate('/questionario_saude'),
      visivel: isIdosoOuCuidador,
    },
    {
      // ✅ Cuidador vê respostas do próprio usuário logado
      icon: <AssignmentIcon sx={{ fontSize: 40 }} color="secondary" />,
      title: 'Respostas do Questionário',
      desc: 'Visualize as respostas enviadas no questionário.',
      onClick: () => navigate('/respostas_questionario'),
      visivel: isCuidador,
    },
    {
      // ✅ Admin vai para página de seleção de paciente
      icon: <AssignmentIcon sx={{ fontSize: 40 }} color="secondary" />,
      title: 'Respostas do Questionário',
      desc: 'Selecione um paciente para ver suas respostas.',
      onClick: () => navigate('/selecionar_paciente_respostas'),
      visivel: isAdmin,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
        mt: 2,
      }}
    >
      {items
        .filter((m) => m.visivel)
        .map((m) => (
          <ModuleCard
            key={m.title}
            icon={m.icon}
            title={m.title}
            description={m.desc}
            onClick={m.onClick}
          />
        ))}
    </Box>
  );
}