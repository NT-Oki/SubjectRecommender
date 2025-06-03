import { Box, Typography, CircularProgress, Button, Tooltip, TextField, Select, MenuItem, Pagination } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower, } from "react-icons/gi";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
const ScoreAdmin = () => {
    interface UserDTO {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmentYear: number; // Lưu ý: bạn có viết sai chính tả, nên giữ nguyên hoặc sửa lại
    }

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
        user: UserDTO;
        subject: Subject;
        semester: number;
        score: number;
        passed: number;
        year: number;
        utility: number;
        preSubjects: Subject[];
    }

    const [data, setData] = useState<Score[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchUserScore = async () => {
            const token = sessionStorage.getItem("token");
            // const userId = sessionStorage.getItem("userId");

            try {
                setIsLoading(true);
                const response = await axios.get(API_ENDPOINTS.ADMIN.SCORE, {
                    // params: {
                    //     userId: `${userId}`,
                    // },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserScore();
    }, []);

    return (
        // body--------------------------------------
        <>
            <Box
                sx={{
                    backgroundColor: "#3EBE30",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "30px",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    zIndex: 12,
                }}
            >
                <GiTwirlyFlower />
                <Typography
                    sx={{

                        fontFamily: "sans-serif",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        paddingLeft: "5px"
                    }}
                >
                    QUẢN LÝ ĐIỂM
                </Typography>
            </Box>
            {/* <Box
                sx={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "30px",
                    height: "15px",
                    position: "sticky",
                    top: 24,
                    zIndex: 11,
                }}
            >
            </Box> */}
            <Box display="flex" gap={2} mb={2} mt={2} justifyContent={"center"}>
                <TextField label="Mã SV" size="small" />
                <Select defaultValue="" displayEmpty size="small">
                    <MenuItem value="">Học kỳ</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                </Select>
                <TextField label="Môn" size="small" />
                <Select defaultValue="" displayEmpty size="small">
                    <MenuItem value="">Trạng thái</MenuItem>
                    <MenuItem value="Đạt">Đạt</MenuItem>
                    <MenuItem value="Không đạt">Không đạt</MenuItem>
                </Select>
                <Button variant="contained">Tìm</Button>
                <Button variant="outlined">Xuất Excel</Button>
            </Box>

            <Box
                sx={{
                    backgroundColor: "#FFA500",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "30px",
                    height: "35px",
                    position: "sticky",
                    top: 39,
                    zIndex: 10
                    ,

                    "& > *:not(:last-child)": {
                        borderRight: "1px solid white",

                    },
                    "& > *": {
                        margin: "auto",
                        fontFamily: "sans-serif",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"

                    },
                }}
            >
                <Typography flex={0.2}>STT</Typography>
                <Typography flex={0.7}>Mã MH</Typography>
                <Typography flex={1}>Tên môn học</Typography>
                <Typography flex={0.7}>MSSV</Typography>
                <Typography flex={0.5}>Học Kỳ</Typography>
                <Typography flex={0.7}>Năm học</Typography>
                <Typography flex={0.6}>Điểm</Typography>
                <Typography flex={0.6}>Kết quả</Typography>
                <Typography flex={0.5}>Hành Động</Typography>

            </Box>
            {/* ///////// */}

            {isLoading ?
                (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : data ? (data.map((score: Score, index: number) => (

                    <Fragment key={score.id}>
                        {/* <Box
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


                        </Box> */}

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
                            <Tooltip
                                title={
                                    <Box>
                                        <div><strong>Số tín chỉ:</strong> {score.subject.credit}</div>
                                        <div><strong>Nhóm môn học:</strong> {score.subject.subjectGroup.id}</div>
                                        <div><strong>Môn tiên quyết:</strong> {score.preSubjects.map((s: Subject) => s.id).join(', ')}</div>
                                    </Box>
                                }
                                arrow
                                placement="top"
                            >
                                <Typography sx={{ flex: 0.7, cursor: "pointer" }}>
                                    {score.subject.id}
                                </Typography>
                            </Tooltip>
                            <Typography flex={1}>{score.subject.subjectName}</Typography>
                            <Tooltip
                                title={
                                    <Box>
                                        <div><strong>Họ tên:</strong> {score.user.lastName} {score.user.name}</div>
                                        <div><strong>Khoa:</strong> {score.user.major}</div>
                                        <div><strong>Khóa:</strong> {score.user.enrollmentYear}</div>
                                    </Box>
                                }
                                arrow
                                placement="top"
                            >
                                <Typography sx={{ flex: 0.7, cursor: "pointer" }}>
                                    {score.user.id}
                                </Typography>
                            </Tooltip>
                            <Typography flex={0.5}>{score.semester}</Typography>
                            <Typography flex={1}>{score.year} - {score.year + 1}</Typography>
                            <Typography flex={0.6}>{score.score}</Typography>
                            <Box
                                flex={0.5}
                            >
                                <Button
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} color={"orange"} />
                                </Button>

                            </Box>
                        </Box>
                    </Fragment>)
                )) : null
            }
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination count={160} page={10} color="primary" />
            </Box>

            <Typography mt={1} variant="body2" align="right">
                Tổng số: 16.000 bản ghi | Trang {10}/160
            </Typography>
        </>

        //    end Body---------------------------------
    )
}
export default ScoreAdmin;