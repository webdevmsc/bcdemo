import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import { useNavigate } from "react-router";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Fab,
    BottomNavigation,
    BottomNavigationAction,
    IconButton,
    Button,
    Accordion,
    AccordionSummary,
    TextField,
    AccordionDetails,
    CardActionArea,
    Chip,
    useTheme,
    useMediaQuery,
    CardContent,
    MenuItem,
    Menu,
    Avatar,
    ListItemText,
    List,
    ListItemAvatar,
    ListItem,
    Dialog,
    DialogContent,
    DialogTitle, Stack, DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Audiotrack,
    Checklist, ChevronLeft, ChevronRight, Delete, Description, Edit, Email,
    ExpandMore, MoreVert,
    Person, Phone, PictureAsPdf,
    Settings,
    TextSnippet,
    Timeline,
    TrendingUp
} from "@mui/icons-material";
import logo from '../../images/logo.png'
import { saveAs } from "file-saver";
import {
    Card,
    Grid,
    Divider,
    CircularProgress,
} from "@mui/material";
import {BrowserRouter, HashRouter, useParams} from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClientsTable from "../ClientsPage/ClientsPage";
import ClientPage from "../ClientPage/ClientPage";
import store from "../../redux/redux-store";
import ClientsPageContainer from "../ClientsPage/ClientsPageContainer";
import ClientPageContainer from "../ClientPage/ClientPageContainer";
import {Provider} from "react-redux";

// Placeholder Components for Routes
const HomePage = ({ plannedEvents = 5, completedVideos = 3 }) => {
    const navigate = useNavigate();
    const [field1Value, setField1Value] = useState(null)
    const [field2Value, setField2Value] = useState(null)
    const getFirstPdf = async () => {

        const formData = new FormData();
        formData.append("file", field1Value); // Добавляем файл в FormData

        // const res = await axios.post("https://your-api.com/upload", formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data", // Важно!
        //     },
        // });
        //
        //
        setFirstLoading(true)
        try {
            const response = await axios.post("https://ddevkz.somee.com/getPdf", formData,{ responseType: 'blob'} );
            saveAs(response.data, "downloaded-file");
        } catch (error) {
            console.log(error.message);
        } finally {
            setFirstLoading(false)
        }
    }

    const getSecondPdf = async () => {

        const formData = new FormData();
        formData.append("file", field2Value); // Добавляем файл в FormData
        setSecondLoading(true)
        try {
            const response = await axios.post("https://ddevkz.somee.com/upload", formData,{ responseType: 'blob'} );
            saveAs(response.data, "downloaded-file");
        } catch (error) {
            console.log(error.message);
        } finally {
            setSecondLoading(false)
        }
    }

    const [firstLoading, setFirstLoading] = useState(false)
    const [secondLoading, setSecondLoading] = useState(false)

    const handleFile1Change = (event) => {
        const selectedFile = event.target.files[0];
        setField1Value(selectedFile);
    };

    const handleFile2Change = (event) => {
        const selectedFile = event.target.files[0];
        setField2Value(selectedFile);
    };

    useEffect(() => {
    }, [field1Value])
    return (
        <Container sx={{ paddingTop: 3, paddingBottom: 12 }}>
            <Container>
                <Box mt={3}></Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Control panel
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={4}>
                    Manage processes effortlessly
                </Typography>
                <Box display={'flex'}>
                    <Card
                        sx={{
                            height: 120, // Квадратные карточки
                            width: '300px',
                            marginRight: '15px',
                            marginBottom: '15px',
                            borderRadius: 4,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Мягкая тень
                            transition: "0.2s",
                            "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                        }}
                    >
                        <CardActionArea
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={() => navigate('/clients')}
                        >
                            <Person/>
                            <Typography variant="h6" fontWeight="bold">
                                Clients
                            </Typography>
                        </CardActionArea>
                    </Card>
                    <Card
                        sx={{
                            height: 120, // Квадратные карточки
                            width: '300px',
                            marginRight: '15px',
                            marginBottom: '15px',
                            borderRadius: 4,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Мягкая тень
                            transition: "0.2s",
                            "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                        }}
                    >
                        <CardActionArea disabled
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={() => alert('hello')}
                        >
                            <Settings sx={{ color: 'grey' }}/>
                            <Typography sx={{ color: 'grey' }} variant="h6" fontWeight="bold">
                                Settings
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Box>
                <Box display={'flex'}>
                    <Card
                        sx={{
                            height: 120, // Квадратные карточки
                            width: '300px',
                            borderRadius: 4,
                            marginRight: '15px',
                            marginBottom: '15px',
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Мягкая тень
                            transition: "0.2s",
                            "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                        }}
                    >
                        <CardActionArea disabled
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={() => alert('hello')}
                        >
                            <Audiotrack sx={{ color: 'grey' }}/>
                            <Typography color={'grey'} variant="h6" fontWeight="bold">
                                PDF from Audio
                            </Typography>
                        </CardActionArea>
                    </Card>
                    <Card
                        sx={{
                            height: 120, // Квадратные карточки
                            width: '300px',
                            marginRight: '15px',
                            marginBottom: '15px',
                            borderRadius: 4,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Мягкая тень
                            transition: "0.2s",
                            "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                        }}
                    >
                        <CardActionArea disabled
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={() => alert('hello')}
                        >
                            <TextSnippet sx={{ color: 'grey' }}/>
                            <Typography sx={{ color: 'grey' }} variant="h6" fontWeight="bold">
                                PDF from Text
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Box>
            </Container>
        </Container>
    );
};




// Main Component with Routing
const MainApp = () => {


    return (
        <BrowserRouter>
            <Provider store={store}>
                <MainAppContent />
            </Provider>
        </BrowserRouter>
    );
};

const MainAppContent = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f9f9f9" }}>
            {/* AppBar (Header) */}
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Container>
                    <Toolbar>
                        <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon sx={{ color: "#333" }} />
                        </IconButton>
                        <img src={logo} width={200}/>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box mt={6}></Box>
            {/* Main Content with Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/clients" element={<ClientsPageContainer />} />
                <Route exact path="/client/:clientId" element={<ClientPageContainer />} />
            </Routes>
        </Box>
    )
}



export default MainApp;


