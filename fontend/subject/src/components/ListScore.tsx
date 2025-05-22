import { Box, Typography } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
const ListScore = () => {
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
<>

                {data ? Object.entries(data).map(([key, scoreList]) => (

                    <Fragment key={key}>
                        <Box
                            sx={{
                                backgroundColor: "#FFD968",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "30px",
                                height: "30px"
                            }}
                        >
                            <Typography
                            sx={{
                                fontWeight: "bold",
                            }}
                            >
                                {key}
                            </Typography>


                        </Box>
                        {scoreList.map((score: Score, index: any) => (
                            <Box
                                key={score?.id || index}
                                sx={{
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: "30px",
                                    height: "27px",
                                    borderBottom: "1px solid #D9D9D9",

                                    "& > *:not(:last-child)": {
                                        borderRight: "1px solid #D9D9D9",
                                        // để đường gạch bằng chiều cao của Box
                                    },
                                    "& > *": {
                                        margin: "auto",
                                        fontFamily: "sans-serif",
                                        fontSize: "16px",
                                        color: "#272424",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"

                                    },
                                }}
                            >
                                <Typography flex={0.2}>{index + 1}</Typography>
                                <Typography flex={1}>{score.subject?.id}</Typography>
                                <Typography flex={2}>{score.subject?.subjectName}</Typography>
                                <Typography flex={0.5}>{score.subject?.credit}</Typography>
                                <Typography flex={1}>aaaa</Typography>
                                <Typography
                                    flex={0.6}

                                >
                                    {score.subject.subjectGroup.id == "BB" ? "x" : ""}</Typography>
                                <Typography flex={1}>{score.score}</Typography>
                                <Typography flex={0.4}>{score.passed == 1 ? "✔" : "x"}</Typography>
                            </Box>
                        ))}
                    </Fragment>
                )) : null}

</>
           
        //    end Body---------------------------------
    )
}
export default ListScore;