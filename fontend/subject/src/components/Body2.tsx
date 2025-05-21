import { Box, Button, Typography } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { MdSettingsSuggest } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
const Body2 = () => {
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
                top: "140px",
                flexDirection: "row"
            }}
        >
            {/* left----------------------------- */}
            <Box
                sx={{
                    width: "84%",
                    height: "650px",
                    overflowY: "auto",

                }}
            >
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
                        CHƯƠNG TRÌNH ĐÀO TẠO
                    </Typography>
                </Box>
                <Box
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
                    <Typography flex={1}>Mã MH</Typography>
                    <Typography flex={2}>Tên môn học</Typography>
                    <Typography flex={0.5}>Số tín chỉ</Typography>
                    <Typography flex={1}>Môn tiên quyết</Typography>
                    <Typography flex={0.6}>Môn bắt buộc</Typography>
                    <Typography flex={0.4}>Đã học</Typography>
                    <Typography flex={1}>Điểm</Typography>

                </Box>
                {/* ///////// */}

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
                                <Typography flex={0.4}>{score.passed == 1 ? "✔" : "x"}</Typography>
                                <Typography flex={1}>{score.score}</Typography>

                            </Box>
                        ))}
                    </Fragment>
                )) : null}

            </Box>
            {/* end left------------------------------------------ */}
            {/* right------------------------------------- */}

            <Box
                sx={{
                    backgroundColor: "red",
                    // height: "150px",
                    width: "15%",
                    marginLeft: "15px",

                }}
            >



                <Box
                    sx={{
                        backgroundColor: "#3EBE30",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "20px",
                        height: "24px",

                    }}
                >
                    <FaUser color="white" />
                    <Typography
                        sx={{
                            paddingLeft: "4px",
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "white"
                        }}
                    >
                        ĐĂNG NHẬP
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "5px",
                        height: "100%"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            color: "#37BD74",
                            paddingTop: "5px"

                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "Roboto",
                                fontSize: "16px",
                                fontWeight: 400
                            }}
                        >
                            Tài khoản
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "Roboto",
                                fontSize: "16px",
                                fontWeight: 500,
                                paddingLeft: "10px"
                            }}
                        >
                            21130542
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            color: "#37BD74"

                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "Roboto ",
                                fontSize: "16px",
                                fontWeight: 400,
                                width: "35%",

                            }}
                        >
                            Họ và tên
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "Roboto",
                                fontSize: "16px",
                                fontWeight: 500,
                                paddingLeft: "5px"


                            }}>
                            Võ Thị Ngọc Thảo
                        </Typography>
                    </Box>


                    <Button variant="contained"
                        sx={{
                            m: 1,
                            p: 0,
                            backgroundColor: "#FFC107",
                            textTransform: 'none',
                            fontFamily: "sans-serif",
                            color: "#272424",
                            fontWeight: 500,
                            fontSize: "17px",

                        }}
                    >
                        <TbLogout
                            style={{
                                marginRight: "5px"
                            }}

                        /> Đăng xuất
                    </Button>
                    <Box component={"a"}
                        href="#"
                        sx={{
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontStyle: "italic",
                            fontWeight: 500,
                            paddingLeft: "5px",
                            ml: "auto",
                            paddingRight: "5px",
                            color: "#272424"
                        }}
                    >
                        Đổi mật khẩu
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: "white",
                            height: "40px"
                        }}
                    />
                    <Box
                        sx={{
                            backgroundColor: "#3EBE30",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "20px",
                            height: "24px"
                        }}
                    >
                        <FontAwesomeIcon icon={faCogs} color="white" />
                        <Typography
                            sx={{
                                paddingLeft: "5px",
                                fontFamily: "sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "white"
                            }}
                        >
                            TÍNH NĂNG
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: "5px",
                            height: "100%"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                color: "#37BD74",
                                paddingTop: "5px"

                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Roboto",
                                    fontSize: "16px",
                                    fontWeight: 400
                                }}
                            >
                                Tài khoản
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Roboto",
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    paddingLeft: "10px"
                                }}
                            >
                                21130542
                            </Typography>
                        </Box>
                    </Box>




                </Box>
            </Box>
            {/* endright----------------------- */}


        </Box>
        //    end Body---------------------------------
    )
}
export default Body2;