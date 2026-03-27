import { Box } from '@mui/material';
import { ModuleCard } from '../../../components/ModuleCard';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export function ModuleGridMedicoSaude() {
    const navigate = useNavigate();

    const items = [
        {
            icon: <HistoryIcon sx={{ fontSize: 40 }} color="secondary" />,
            title: 'Respostas do Questionário',
            desc: 'Veja as respostas enviadas pelo paciente.',
            onClick: () => navigate('/medico/respostas-questionario'),
        },
        {
            icon: <PersonSearchIcon sx={{ fontSize: 40 }} color="primary" />,
            title: 'Iniciar Consulta',
            desc: 'Selecionar paciente e iniciar atendimento.',
            onClick: () => navigate('/medico'),
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