import { Box} from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import axios from 'axios';
import { useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import InformationAdmin from "./InformationAdmin"
import { Route, Routes } from "react-router-dom"
import ScoreAdmin from "./ScoreAdmin"
import SubjectAdmin from "./SubjectAdmin"
import StudentAdmin from "./StudentAdmin"
const BodyAdmin = () => {
    interface SubjectGroup {
        id: string;
        groupName: string;
    }
    interface Subject {
        id: string;
        subjectName: string;
        credit: number;
        subjectGroup: SubjectGroup;
    }

    interface Score {
        id: number;
        userId: string;
        subject: Subject;
        semester: number;
        score: number;
        passed: number;
        year: number;
        utility: number;
    }

    type DataType = {
        [key: string]: Score[];
    };

    const [data, setData] = useState<DataType | null>(null);
    useEffect(() => {
        const fetchUserScore = async () => {
            const token = sessionStorage.getItem("token");
            const userId = sessionStorage.getItem("userId");

            try {
                const response = await axios.get(API_ENDPOINTS.SCORE, {
                    params: {
                        userId: `${userId}`,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            }
        };

        fetchUserScore();
    }, []);

    return (
       // body--------------------------------------
        <Box
            sx={{
                display: "flex",
                width: "100vw",
                height: "500px",
                position: "fixed",
                top: "128px",
                flexDirection: "row"
            }}
        >
            {/* left----------------------------- */}
            <Box
                sx={{
                    width: "80%",
                    height: "500px",
                    overflowY: "auto",
                    overflowX:"hidden"
                }}
            >
                    <Routes>
        <Route path="score" element={<ScoreAdmin />} />
        <Route path="subject" element={<SubjectAdmin />} />
        <Route path="student" element={<StudentAdmin/>} />
        
      </Routes>
            </Box>
            {/* end left------------------------------------------ */}

            {/* right------------------------------------- */}
            <Box
                sx={{
                    backgroundColor: "red",
                    // height: "150px",
                    width: "18%",
                    marginLeft: "15px",
                }}
            >
            <InformationAdmin />
            </Box>
            {/* endright----------------------- */}
        </Box>
        //    end Body---------------------------------
    )
}
export default BodyAdmin;