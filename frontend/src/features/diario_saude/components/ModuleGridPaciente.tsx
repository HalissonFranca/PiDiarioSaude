import { Box } from '@mui/material';
import { ModuleCard } from '../../../components/ModuleCard';
import HistoryIcon from '@mui/icons-material/History';
<<<<<<< HEAD
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
=======
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AssignmentIcon from '@mui/icons-material/Assignment';
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
import { useNavigate } from 'react-router-dom';

export function ModuleGridSaude() {
  const navigate = useNavigate();

<<<<<<< HEAD
=======
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

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
  const items = [
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} color="primary" />,
      title: 'Histórico de Consultas',
      desc: 'Veja consultas anteriores.',
      onClick: () => navigate('/historico_consultas'),
<<<<<<< HEAD
=======
      visivel: true,
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
    },
    {
      icon: <CoronavirusIcon sx={{ fontSize: 40 }} color="info" />,
      title: 'Informações de Saúde',
      desc: 'Doenças cadastradas do paciente.',
      onClick: () => navigate('/informacoes_saude'),
<<<<<<< HEAD
    },
    {
=======
      visivel: true,
    },
    {
      // ✅ Só idoso e cuidador respondem o questionário
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
      icon: <CoronavirusIcon sx={{ fontSize: 40 }} color="success" />,
      title: 'Questionário de Saúde',
      desc: 'Responda o questionário de avaliação.',
      onClick: () => navigate('/questionario_saude'),
<<<<<<< HEAD
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} color="secondary" />,
      title: 'Respostas do Questionário',
      desc: 'Veja suas respostas enviadas no questionário.',
      onClick: () => navigate('/respostas_questionario'),
=======
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
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
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
<<<<<<< HEAD
      {items.map((m) => (
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
=======
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
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
