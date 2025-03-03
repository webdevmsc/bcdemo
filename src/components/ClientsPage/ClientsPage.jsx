import {
    Box,
    Button,
    Card,
    CardContent, Chip, CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    IconButton, Stack, TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useNavigate} from "react-router";
import {Audiotrack, ChevronLeft, ChevronRight, Description, Person} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import axios from "axios";

const getIndustryChip = (industry) => {
    const industryStyles = {
        IT: { color: "#007AFF", background: "#E6F0FF" }, // Голубой (Технологии)
        Marketing: { color: "#FF9500", background: "#FFF5E6" }, // Оранжевый (Маркетинг)
        Finance: { color: "#34C759", background: "#E6F9EB" }, // Зелёный (Финансы)
        Creative: { color: "#AF52DE", background: "#F5E6FF" }, // Фиолетовый (Креативные индустрии)
        Consulting: { color: "#FF3B30", background: "#FFE6E6" }, // Красный (Консалтинг)
        Retail: { color: "#8E8E93", background: "#F2F2F7" }, // Серый (Розничная торговля)
        Legal: { color: "#5AC8FA", background: "#E6F9FF" }, // Голубой (Юриспруденция)
        Tech: { color: "#FF2D55", background: "#FFD6E7" }, // Розовый (Стартапы и инновации)
        B2B: { color: "#FFCC00", background: "#FFF5CC" }, // Жёлтый (B2B-услуги)
        Education: { color: "#FF9500", background: "#FFE6C4" }, // Оранжевый (Образование)
        Healthcare: { color: "#FF3B30", background: "#FFDDD8" }, // Красный (Медицина)
        Energy: { color: "#32D74B", background: "#D9FCE6" }, // Ярко-зелёный (Энергетика)
        Automotive: { color: "#5856D6", background: "#E6E6FA" }, // Фиолетовый (Авто)
        Luxury: { color: "#C0B283", background: "#F4EFEA" }, // Бежевый (Люкс-сегмент)
        Sports: { color: "#FF2D55", background: "#FFD6E7" } // Розовый (Спорт и фитнес)
    };

    return (
        <Chip
            label={industry}
            sx={{
                fontWeight: "500",
                borderRadius: "6px",
                px: 1.2,
                py: 0.3,
                fontSize: "13px",
                color: industryStyles[industry]?.color || "#555",
                backgroundColor: industryStyles[industry]?.background || "#f5f5f5"
            }}
        />
    );
};

// Next Action в стильный Chip
const getNextActionChip = (action) => {
    return (
        <Chip
            label={action}
            sx={{
                fontWeight: "500",
                borderRadius: "6px",
                px: 1,
                py: 0.3,
                fontSize: "13px",
                backgroundColor: "#f2f2f7",
                color: "#333",
            }}
        />
    );
};



// Last Interaction в стильный Chip
const getLastInteractionChip = (date) => (
    <Chip
        label={date}
        sx={{
            fontWeight: "500",
            borderRadius: "6px",
            px: 1,
            py: 0.3,
            fontSize: "13px",
            backgroundColor: "#e6f0ff",
            color: "#007aff",
        }}
    />
);

// Created At в более светлый стиль
const getCreatedAtChip = (date) => (
    <Chip
        label={date}
        sx={{
            fontWeight: "500",
            borderRadius: "6px",
            px: 1,
            py: 0.3,
            fontSize: "13px",
            backgroundColor: "#f2f2f7",
            color: "#666",
        }}
    />
);

// Apple-style статусы (цвета логичнее)
const getStatusChip = (status) => {
    const statusStyles = {
        Lead: { color: "#34c759", background: "#e6f9eb" }, // Зелёный (горячий лид)
        Prospect: { color: "#007aff", background: "#e6f0ff" }, // Голубой (потенциальный клиент)
        Negotiation: { color: "#ffcc00", background: "#fff5cc" }, // Жёлтый (переговоры)
        Client: { color: "#0a84ff", background: "#e6f0ff" }, // Синий (действующий клиент)
        Closed: { color: "#5856d6", background: "#e6e6fa" }, // Фиолетовый (сделка закрыта)
        Lost: { color: "#ff3b30", background: "#ffe6e6" }, // Красный (потеряно)
        Pending: { color: "#ff9500", background: "#fff5e6" }, // Оранжевый (на рассмотрении)
        InProgress: { color: "#5ac8fa", background: "#e6faff" }, // Голубой (в процессе)
        Inactive: { color: "#8e8e93", background: "#f2f2f7" } // Серый (неактивный)
    };

    return (
        <Chip
            label={status}
            sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                fontSize: "14px",
                color: statusStyles[status]?.color,
                backgroundColor: statusStyles[status]?.background,
            }}
        />
    );
};



// Кнопка "Manage" (⋮) → Переход на страницу клиента
const ManageActions = ({ clientId }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return isMobile ? (
        <Button
            onClick={() => navigate(`/client/${clientId}`)}
            sx={{
                textTransform: "none",
                color: "#007AFF",
                fontWeight: "600",
                fontSize: "16px",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                padding: 0,
                minWidth: "unset",
                "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                "&:active": { opacity: 0.6 },
            }}
        >
            Manage <ChevronRight sx={{ fontSize: "20px", color: "#007AFF" }} />
        </Button>
    ) : (
        <IconButton
            onClick={() => navigate(`/client/${clientId}`)}
            sx={{ color: "#555", "&:hover": { color: "#000" } }}
        >
            <ChevronRight/>
        </IconButton>
    );
};


// Колонки DataGrid
const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 120 },
    { field: "industry", headerName: "Industry", flex: 1, minWidth: 150, renderCell: (params) => getIndustryChip(params.value) },
    { field: "status", headerName: "Status", flex: 1, minWidth: 150, renderCell: (params) => getStatusChip(params.value) },
    { field: "lastInteraction", headerName: "Last Interaction", flex: 1, minWidth: 140, renderCell: (params) => getLastInteractionChip(params.value) },
    { field: "nextAction", headerName: "Next Action", flex: 1.2, minWidth: 180, renderCell: (params) => getNextActionChip(params.value) },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 140, renderCell: (params) => getCreatedAtChip(params.value) },
    {
        field: "actions",
        headerName: "",
        flex: 0.6,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => <ManageActions clientId={params.row.id} />,
    },
];




const ClientsTable = ({ clients, createClient }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const [openNew, setOpenNew] = useState(false)

    const [clientValues, setClientValues] = useState(null)

    useEffect(() => {
        if (clients[0] != null) {
            setClientValues(Object.fromEntries(
                Object.keys(clients[0]).map(key => [key, ''])
            ))
        }
    }, [clients])

    const handleClose = () => {
        setClientValues(Object.fromEntries(
            Object.keys(clients[0]).map(key => [key, ''])
        ))
        setOpenNew(false)
    }


    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const [loading, setLoading] = useState(false)

    const handleAudioAttach = async (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]); // Добавляем файл в FormData
        try {
            setLoading(true)
            const response = await axios.post("https://ddevkz.somee.com/getUserInfoByAudio", formData);
            setClientValues({ ...clientValues, ...response.data })
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    };
    const handleTextAttach = async (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]); // Добавляем файл в FormData
        try {
            setLoading(true)
            const response = await axios.post("https://ddevkz.somee.com/getUserInfoByText", formData);
            setClientValues({ ...clientValues, ...response.data })
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    };

    const handleSave = () => {
        createClient({...clientValues, interactions: [], id: clients.length + 1})
        setOpenNew(false)
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} alignItems={'center'}>
                    <IconButton onClick={() => navigate(-1)} size={'large'} color={'primary'}>
                        <ChevronLeft/>
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold">
                        Clients
                    </Typography>
                </Box>
                <Box>
                    <Button startIcon={<Person/>} onClick={() => setOpenNew(true)} variant={'contained'} color={'primary'}><Typography>Create</Typography></Button>
                </Box>
            </Box>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Manage and track your business clients efficiently.
            </Typography>

            {isMobile ? (
                <Grid container spacing={2}>
                    {clients.map((client) => (
                        <Grid item xs={12} key={client.id}>
                            <Card sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                                <CardContent>
                                    {/* Имя и компания */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" fontWeight="bold">{client.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{client.company}</Typography>
                                    </Box>

                                    {/* Статус и индустрия */}
                                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                                        {getStatusChip(client.status)}
                                        {getIndustryChip(client.industry)}
                                    </Box>

                                    {/* Next Action */}
                                    <Box mt={2}>
                                        <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                            Next Action:
                                        </Typography>
                                        {getNextActionChip(client.nextAction)}
                                    </Box>

                                    {/* Даты */}
                                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                                Last Interaction:
                                            </Typography>
                                            {getLastInteractionChip(client.lastInteraction)}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                                Created At:
                                            </Typography>
                                            {getCreatedAtChip(client.createdAt)}
                                        </Box>
                                    </Box>

                                    {/* Кнопка Manage */}
                                    <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
                                        <ManageActions clientId={client.id} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ backgroundColor: "white", borderRadius: 3 }}>
                    <DataGrid autoHeight rows={clients} columns={columns} disableSelectionOnClick />
                </Box>
            )}
            <Dialog open={openNew} onClose={handleClose} maxWidth={'sm'} fullWidth>
                <DialogTitle>New Client</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                        {
                            loading ?
                                <Box m={2}>
                                    <CircularProgress/>
                                </Box>
                                :
                                <>
                                    {/* Attach Audio */}
                                    <Button variant="outlined" component="label" startIcon={<Audiotrack />}>
                                        Attach Audio
                                        <input type="file" accept="audio/*" hidden onChange={handleAudioAttach} />
                                    </Button>

                                    {/* Attach Text */}
                                    <Button variant="outlined" component="label" startIcon={<Description />}>
                                        Attach Text
                                        <input type="file" accept=".txt,.doc,.docx" hidden onChange={handleTextAttach} />
                                    </Button>
                                </>
                        }
                    </Stack>
                    <Box display={'flex'} flexDirection={'column'}>
                        {clientValues &&
                            Object.keys(clientValues)
                                .filter(x => x !== 'interactions' && x !== 'id')
                                .map(key => (
                                    <Box mt={1} key={key}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            label={capitalizeFirstLetter(key)}
                                            value={clientValues[key]}
                                            onChange={(event) => setClientValues(prev => ({
                                                ...prev,
                                                [key]: event.target.value
                                            }))}
                                        />
                                    </Box>
                                ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientsTable;