import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent, Chip, CircularProgress,
    Container,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack, TextField,
    Typography
} from "@mui/material";
import { saveAs } from "file-saver";
import {Add, Audiotrack, ChevronLeft, Description, Edit, Email, Phone, PictureAsPdf} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {updateClients} from "../../redux/clients-reducer";


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

const getInteractionPdf = async (request) => {
    try {
        const response = await axios.post("https://ddevkz.somee.com/getPdfForAction", request);
        saveAs(response.data, `User-${request.newUser.id}-interaction-${request.highlightId}`);
    } catch (error) {
        console.log(error.message);
    }
}

const ClientPage = ({ clients }) => {
    const navigate = useNavigate();

    const { clientId } = useParams();

    const [client, setClient] = useState(null)

    useEffect(() => {
        setClient(clients.find(x => x.id == clientId))
    }, [clientId])

    const [interactions, setInteractions] = useState([]);
    useEffect(() => {
        if (client != null) setInteractions(client.interactions)
    }, [client])
    const [open, setOpen] = useState(false);
    const [currentInteraction, setCurrentInteraction] = useState(null);
    const [openNew, setOpenNew] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [textFile, setTextFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const handleAudioAttach = async (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]); // Добавляем файл в FormData
        try {
            setLoading(true)
            const response = await axios.post("https://ddevkz.somee.com/getSummary", formData);
            setSummary(response.data)
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
            const response = await axios.post("https://ddevkz.somee.com/getSummaryByText", formData);
            setSummary(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    };
    const handleRemoveFiles = () => {
        setAudioFile(null);
        setTextFile(null);
    };
    const handleEditClick = (interaction, index) => {
        if (!interaction.summary) {
            setSummary('')
        } else setSummary(interaction.summary)
        setCurrentInteraction({ ...interaction, status: interaction?.status ?? '', index });
        setAudioFile(null);
        setPdfFile(null);
        setOpen(true);
    };
    const handleSave = () => {
        console.log(summary)
        const updated = interactions.map((item, idx) =>
            idx === currentInteraction.index ? { ...currentInteraction, audioFile, pdfFile: true, summary: summary ?? '' } : {...item, summary: item.summary ?? ''}
        );
        setInteractions(updated);
        console.log(interactions)
        setOpen(false);
    };
    const handleSaveNew = () => {
        setInteractions([{ ...currentInteraction, summary, pdfFile: true, id: interactions.length + 1 }, ...interactions])
        setOpenNew(false);
        console.log( { client: { ...client, interactions: [{...currentInteraction, summary: summary}, ...interactions] },  })
    };
    const handleOpenNew = () => {
        setSummary('')
        setCurrentInteraction({ status: '', type: '', date: null, summary: '', notes: '' })
        setOpenNew(true)
    }
    const handleSaveEdit = () => {
        setClient({ ...clientValues, interactions: interactions, id: client.id, pdfFile: null })
        setOpenEdit(false)
    }
    const handleUploadPdfForInteraction = async (id) => {

        let request = {
            newUser: client,
            interactions: interactions,
            highlightId: id
        }
        console.log(request)
        try {
            const response = await axios.post("https://ddevkz.somee.com/getPdfForAction", request, { responseType: 'blob' });
            saveAs(response.data, `User-${request.newUser.id}-interaction-${request.highlightId}.pdf`);
        } catch (error) {
            console.log(error.message);
        }
    }

    const isFileAttached = audioFile || textFile || loading;
    const [clientValues, setClientValues] = useState(null)
    useEffect(() => {
        if (client != null) {
            setClientValues({ ...client })
        }
    }, [client])



    const handleDownloadPdf = async () => {
        if (client.pdfFile) saveAs(client.pdfFile, `User-${client.id}.pdf`)
        else {
            const response = await axios.post("https://ddevkz.somee.com/getPdfForNewClient", client, { responseType: 'blob' });
            saveAs(response.data, `User-${client.id}.pdf`);
        }
    }

    if (!client) {
        return <Typography variant="h6" color="error">Client not found.</Typography>;
    }

    const handleGoBack = () => {
        if (client != null) {
            let list = [...clients];
            let existingClient = list.find(x => x.id === client.id);
            Object.assign(existingClient, { ...clientValues, interactions });
            updateClients(list);
            navigate(-1)
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={handleGoBack} size="large" color="primary">
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">Client Details</Typography>
            </Box>

            <Card sx={{ p: 3, borderRadius: 4, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
                <CardContent>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography variant="h4" fontWeight="bold">{client.name}</Typography>
                        <Button startIcon={<PictureAsPdf />} onClick={handleDownloadPdf} variant="contained" color="secondary">
                            Get PDF File
                        </Button>
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">{client.company}</Typography>

                    <Box display="flex" gap={1} mt={2}>
                        {getStatusChip(client.status)}
                        {getIndustryChip(client.industry)}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Next Action:</Typography>
                            {getNextActionChip(client.nextAction)}
                        </Box>

                        <Box display="flex" gap={2}>
                            <Typography><strong>Last Interaction:</strong> {client.lastInteraction}</Typography>
                            <Typography><strong>Created At:</strong> {client.createdAt}</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" gap={3} alignItems="center">
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                                <Typography>{client.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Phone:</Typography>
                                <Typography>{client.phone}</Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" gap={2} mt={2}>
                            <Button startIcon={<Email />} variant="contained" color="primary">
                                Send Email
                            </Button>
                            <Button startIcon={<Phone />} variant="outlined" color="primary">
                                Call
                            </Button>
                            <Button onClick={() => setOpenEdit(true)} startIcon={<Edit />} variant="outlined" color="secondary">
                                Edit
                            </Button>
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Box mb={2}>
                        <Typography variant={'body2'}>{client.description}</Typography>
                    </Box>

                    <Box display={'flex'} alignItems={'center'}>
                        <Typography variant="h6" fontWeight="bold">Interaction History</Typography>
                        <Box ml={1}>
                            <IconButton onClick={handleOpenNew}>
                                <Add/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 4 }} />
                    {interactions.map((interaction, index) => (
                        <Card key={index} sx={{ mt: 2, position: 'relative' }}>
                            <CardContent>
                                <Chip
                                    color={'primary'}
                                    label={interaction.status}
                                    sx={{
                                        borderRadius: "8px",
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: "14px",
                                    }}
                                />
                                <Box mt={1} mb={1}></Box>
                                <Typography fontWeight="600">{interaction.type} ({interaction.date})</Typography>
                                <Typography variant="subtitle2"><strong>Summary:</strong> {interaction.summary}</Typography>
                                <Typography variant="body2"><strong>Notes:</strong> {interaction.notes}</Typography>
                                {interaction.audioFile && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "primary.main" }}>
                                        🎧 Audio: {interaction.audioFile.name}
                                    </Typography>
                                )}


                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => handleUploadPdfForInteraction(interaction.id)}
                                    startIcon={<PictureAsPdf color="error"/>}
                                    sx={{ mt: 1 }}
                                >
                                    Download
                                </Button>

                                <IconButton
                                    onClick={() => handleEditClick(interaction, index)}
                                    size="small"
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <Edit fontSize="small"/>
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth={'sm'} fullWidth>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Box display={'flex'} flexDirection={'column'}>
                        {clientValues &&
                            Object.keys(clientValues)
                                    .filter(x => x !== 'interactions' && x !== 'id' && x !== 'pdfFile')
                                    .map(key => (
                                        <Box mt={1} key={key}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                label={key}
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
                    <Button onClick={() => { setClientValues({ ...client }); setOpenEdit(false) }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Interaction</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={currentInteraction?.date || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        margin="dense"
                        value={currentInteraction?.type || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, type: e.target.value })}
                    />
                    <Box mt={3}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Summary:
                        </Typography>

                        <TextField
                            multiline
                            minRows={4}
                            fullWidth
                            placeholder="Add interaction summary..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
                        />

                        {!isFileAttached && (
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
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
                            </Stack>
                        )}

                        {loading && <Box p={2}>
                            <CircularProgress/>
                        </Box>}

                        {isFileAttached && (
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
                                {audioFile && (
                                    <Chip
                                        icon={<Audiotrack />}
                                        label={audioFile.name}
                                        onDelete={handleRemoveFiles}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}

                                {textFile && (
                                    <Chip
                                        icon={<Description />}
                                        label={textFile.name}
                                        onDelete={handleRemoveFiles}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        )}
                    </Box>

                    <TextField
                        label="Status"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                        value={currentInteraction?.status || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, status: e.target.value })}
                    />


                    <TextField
                        label="Notes"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                        value={currentInteraction?.notes || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, notes: e.target.value })}
                    />


                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ mt: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}
                    >

                        {/* Отображение выбранных файлов */}
                        {audioFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <Audiotrack color="primary" />
                                <Typography variant="body2" noWrap>{audioFile.name}</Typography>
                            </Box>
                        )}

                        {textFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <Description color="primary" />
                                <Typography variant="body2" noWrap>{textFile.name}</Typography>
                            </Box>
                        )}

                        {pdfFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <PictureAsPdf color="error" />
                                <Typography variant="body2" noWrap>{pdfFile.name}</Typography>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openNew} onClose={() => setOpenNew(false)} maxWidth="sm" fullWidth>
                <DialogTitle>New Event</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={currentInteraction?.date || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        margin="dense"
                        value={currentInteraction?.type || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, type: e.target.value })}
                    />
                    <Box mt={3}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Summary:
                        </Typography>

                        <TextField
                            multiline
                            minRows={4}
                            fullWidth
                            placeholder="Add interaction summary..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
                        />

                        {!isFileAttached && (
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
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
                            </Stack>
                        )}

                        {loading && <Box p={2}>
                            <CircularProgress/>
                        </Box>}

                        {isFileAttached && (
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
                                {audioFile && (
                                    <Chip
                                        icon={<Audiotrack />}
                                        label={audioFile.name}
                                        onDelete={handleRemoveFiles}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}

                                {textFile && (
                                    <Chip
                                        icon={<Description />}
                                        label={textFile.name}
                                        onDelete={handleRemoveFiles}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        )}
                    </Box>
                    <TextField
                        label="Status"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                        value={currentInteraction?.status || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, status: e.target.value })}
                    />
                    <TextField
                        label="Notes"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                        value={currentInteraction?.notes || ""}
                        onChange={e => setCurrentInteraction({ ...currentInteraction, notes: e.target.value })}
                    />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ mt: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}
                    >
                        {/* Отображение выбранных файлов */}
                        {audioFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <Audiotrack color="primary" />
                                <Typography variant="body2" noWrap>{audioFile.name}</Typography>
                            </Box>
                        )}

                        {textFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <Description color="primary" />
                                <Typography variant="body2" noWrap>{textFile.name}</Typography>
                            </Box>
                        )}

                        {pdfFile && (
                            <Box display="flex" alignItems="center" gap={1} sx={{ maxWidth: 200 }}>
                                <PictureAsPdf color="error" />
                                <Typography variant="body2" noWrap>{pdfFile.name}</Typography>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveNew}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientPage;