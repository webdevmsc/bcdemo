import axios from "axios";

const CREATE_CLIENT = 'CREATE_CLIENT'
const SET_CLIENTS = 'SET_CLIENTS'

let initialState = {
    clients: [
        {
            id: 1,
            name: "John Smith",
            company: "Tech Solutions",
            status: "Lead",
            industry: "IT",
            lastInteraction: "2024-02-10",
            nextAction: "Follow-up call",
            createdAt: "2023-12-15",
            email: "john.smith@example.com",
            phone: "+1 123 456 7890",
            description: "John Smith is the CTO at Tech Solutions, an innovative IT firm. He is highly interested in digital transformation and cloud solutions. John has a strong technical background and values practical, scalable technologies. His main challenges involve integrating legacy systems with modern platforms. John is approachable, detail-oriented, and highly engaged in discussions about emerging technology trends.",
            interactions: [
                { id: 1, date: "2024-02-10", type: "Call", status: "Completed", notes: "Discussed product interest.", summary: '' },
                { id: 2, date: "2024-01-15", type: "Email", status: "Sent", notes: "Sent product details.", summary: '' },
                { id: 3, date: "2023-12-20", type: "Meeting", status: "Completed", notes: "Initial meeting.", summary: '' },
                { id: 4, date: "2023-12-15", type: "Lead Created", status: "Completed", notes: "Client added to CRM.", summary: '' },
            ]
        },
        {
            id: 2,
            name: "Emma Johnson",
            company: "Market Experts",
            status: "Negotiation",
            industry: "Marketing",
            lastInteraction: "2024-02-12",
            nextAction: "Send proposal",
            createdAt: "2024-01-05",
            email: "emma.johnson@example.com",
            phone: "+1 987 654 3210",
            description: "Emma Johnson leads strategic initiatives at Market Experts, a renowned marketing consultancy. She excels in developing targeted marketing campaigns with measurable ROI. Emma values data-driven decision-making and precise analytics. Currently, she seeks a partner to enhance her team's digital marketing capabilities. Emma is collaborative, insightful, and focuses heavily on clear, impactful communication.",
            interactions: [
                { id: 1, date: "2024-02-12", type: "Meeting", status: "Completed", notes: "Negotiation started.", summary: '' },
                { id: 2, date: "2024-01-20", type: "Email", status: "Sent", notes: "Shared proposal outline.", summary: '' },
                { id: 3, date: "2024-01-10", type: "Call", status: "Completed", notes: "Discussed initial scope.", summary: '' },
                { id: 4, date: "2024-01-05", type: "Lead Created", status: "Completed", notes: "New lead created.", summary: '' },
            ]
        },
        {
            id: 3,
            name: "Michael Brown",
            company: "Finance Pro",
            status: "Closed",
            industry: "Finance",
            lastInteraction: "2024-02-08",
            nextAction: "Client onboarding",
            createdAt: "2023-11-30",
            email: "michael.brown@example.com",
            phone: "+44 20 7946 0123",
            description: "Michael Brown is the CFO of Finance Pro, specializing in financial advisory and risk management solutions. He has extensive experience in managing complex financial projects. Michael prefers robust and secure financial technologies to streamline operations. His decision-making process is analytical and thorough. He recently finalized a major partnership and is currently in the onboarding stage.",
            interactions: [
                { id: 1, date: "2024-02-08", type: "Contract", status: "Completed", notes: "Contract signed.", summary: '' },
                { id: 2, date: "2024-01-15", type: "Meeting", status: "Completed", notes: "Final presentation.", summary: '' },
                { id: 3, date: "2023-12-10", type: "Email", status: "Sent", notes: "Proposal sent.", summary: '' },
                { id: 4, date: "2023-11-30", type: "Lead Created", status: "Completed", notes: "Initial lead created.", summary: '' },
            ]
        },
        {
            id: 4,
            name: "Sophia Lee",
            company: "Design Studio",
            status: "Lost",
            industry: "Creative",
            lastInteraction: "2024-01-28",
            nextAction: "No further action",
            createdAt: "2023-10-25",
            email: "sophia.lee@example.com",
            phone: "+33 1 45 67 89 01",
            description: "Sophia Lee is the creative director at Design Studio, a boutique creative agency. She values originality, artistic integrity, and attention to detail. Sophia was initially interested in exploring new digital design tools. However, after reviewing proposals, she decided to stay with existing providers. Sophia remains open-minded but selective regarding new collaborations.",
            interactions: [
                { id: 1, date: "2024-01-28", type: "Call", status: "Completed", notes: "Client declined proposal.", summary: '' },
                { id: 2, date: "2023-12-20", type: "Email", status: "Sent", notes: "Sent proposal.", summary: '' },
                { id: 3, date: "2023-11-05", type: "Meeting", status: "Completed", notes: "Initial discussion",  summary: '' },
                { id: 4, date: "2023-10-25", type: "Lead Created", status: "Completed", notes: "Lead captured.", summary: '' },
            ]
        },
        {
            id: 5,
            name: "Daniel Wilson",
            company: "Biz Growth",
            status: "Lead",
            industry: "Consulting",
            lastInteraction: "2024-02-11",
            nextAction: "Schedule meeting",
            createdAt: "2024-01-20",
            email: "daniel.wilson@example.com",
            phone: "+49 151 23456789",
            description: "Daniel Wilson is a senior consultant at Biz Growth, focusing on strategic business growth and transformation. He is particularly interested in innovative strategies that drive sustainable results. Daniel is evaluating new partners to enhance his service offerings. His approach emphasizes long-term relationships and value-driven solutions. Daniel is proactive, professional, and values clear, actionable insights.",
            interactions: [
                { id: 1, date: "2024-02-11", type: "Email", status: "Sent", notes: "Requested meeting.", summary: '' },
                { id: 2, date: "2024-01-25", type: "Call", status: "Completed", notes: "Explained services.", summary: '' },
                { id: 3, date: "2024-01-21", type: "Email", status: "Sent", notes: "Introductory email sent.", summary: '' },
                { id: 4, date: "2024-01-20", type: "Lead Created", status: "Completed", notes: "New lead entered.", summary: '' },
            ]
        },
        {
            id: 6,
            name: "Olivia Martinez",
            company: "Retail Plus",
            status: "Negotiation",
            industry: "Retail",
            lastInteraction: "2024-02-14",
            nextAction: "Price discussion",
            createdAt: "2023-12-05",
            email: "olivia.martinez@example.com",
            phone: "+34 612 345 678",
            description: "Olivia Martinez heads purchasing operations at Retail Plus, a prominent retail company. She has expertise in supply chain management and vendor negotiations. Olivia is currently evaluating pricing models to improve cost efficiency. She emphasizes reliability, transparency, and strong business ethics. Olivia is decisive, pragmatic, and meticulous in her evaluation process.",
            interactions: [
                { id: 1, date: "2024-02-14", type: "Meeting", status: "Completed", notes: "Discussed pricing.", summary: '' },
                { id: 2, date: "2024-01-15", type: "Email", status: "Sent", notes: "Initial proposal sent.", summary: '' },
                { id: 3, date: "2023-12-15", type: "Call", status: "Completed", notes: "Intro call.", summary: '' },
                { id: 4, date: "2023-12-05", type: "Lead Created", status: "Completed", notes: "Lead added.", summary: '' },
            ]
        },
        // Клиенты 7–15 аналогично заполняются по такому же принципу.
    ]
}

const chargersReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CLIENT:
            return { ...state, clients: [...state.clients, action.client] }
        case SET_CLIENTS:
            return { ...state, clients: action.clients }
        default:
            return state;
    }
}

const createNewClient = (client) => ({ type: CREATE_CLIENT, client })
const updateClientsList = (clients) => ({ type: SET_CLIENTS, clients })

export const updateClients = (clients) => async (dispatch) => {
    dispatch(updateClientsList(clients))
}

export const createClient = (client) => async (dispatch) => {
    try {
        const response = await axios.post("https://ddevkz.somee.com/getPdfForNewClient", client, { responseType: 'blob' });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        dispatch(createNewClient({ ...client, pdfFile: pdfBlob }))
    } catch (error) {
        console.log(error.message);
    }
}


export default chargersReducer;