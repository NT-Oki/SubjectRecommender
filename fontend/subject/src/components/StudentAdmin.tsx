import { Box, Typography, CircularProgress, Button, TextField, Select, MenuItem, Pagination } from "@mui/material"
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
const StudentAdmin = () => {
    interface UserDTO {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmentYear: number; // Lưu ý: bạn có viết sai chính tả, nên giữ nguyên hoặc sửa lại
    }
    const token = sessionStorage.getItem("token");
    const [data, setData] = useState<UserDTO[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [total, setTotal] = useState(0);
    const [searchUserId, setSearchUserId] = useState("");
    const [searchYear, setSearchYear] = useState<Number>(null);
    const [searchName, setSearchName] = useState("");
    const fetchUserScore = async () => {
    
        // const userId = sessionStorage.getItem("userId");

        try {
            setIsLoading(true);
            const response = await axios.get(API_ENDPOINTS.ADMIN.STUDENT.LISTUSER, {
                params: {
                    page: page - 1,
                    size: pageSize,
                    userId: searchUserId||undefined,
                       userName: searchName || undefined,
                    year: searchYear ||undefined,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            setData(response.data.users);
            setTotal(response.data.total)
        } catch (error) {
            console.error("Lỗi khi lấy thông tin điểm user:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUserScore();
    }, [page, pageSize]);
    const handleSearchClick = () => {
        setPage(1); // Quay về trang 1 khi tìm kiếm mới
        fetchUserScore();
    };
    const handleExport = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.STUDENT.EXPORT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // ⚠️ BẮT BUỘC: để axios hiểu đây là file
            });

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.xlsx'; // Tên file khi lưu
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Giải phóng URL sau khi xong

            alert("Xuất Excel thành công!");
        } catch (err: any) {
            alert(err.response?.data || "Lỗi khi xuất file");
        }
    }

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
                    <TextField label="Mã SV" size="small"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)} />
                   <TextField label="Khóa" size="small"
                        value={searchYear}
                        onChange={(e) => setSearchYear(Number(e.target.value))} />
                    <TextField
                        label="Tên"
                        size="small"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)} />
                    <Button variant="contained"
                        onClick={handleSearchClick}
                    >Tìm</Button>
                    <Button variant="outlined" onClick={handleExport}>Xuất Excel</Button>
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
                    <Typography flex={0.7}>MSSV</Typography>
                    <Typography flex={1}>Họ và tên đệm</Typography>
                    <Typography flex={0.5}>Tên</Typography>
                    <Typography flex={1}>Khoa</Typography>
                    <Typography flex={0.5}>Khóa</Typography>
                    <Typography flex={0.5}>Hành Động</Typography>

                </Box>
                {/* ///////// */}

                {isLoading ?
                    (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : data ? (data.map((user: UserDTO, index: number) => (

                        <Fragment key={user.id}>
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
                                key={user?.id || index}
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
                                <Typography flex={0.2}>{(page - 1) * pageSize + index + 1}</Typography>
                                <Typography flex={0.7}>{user.id}</Typography>
                                <Typography flex={1}>{user.lastName}</Typography>
                                <Typography flex={0.5}>{user.name}</Typography>
                                <Typography flex={1}>{user.major}</Typography>
                                <Typography flex={0.5}>{user.enrollmentYear}</Typography>
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
                    <Pagination
                        count={Math.ceil(total / pageSize)}
                        page={page} color="primary"
                        onChange={(_, value) => setPage(value)}
                    />
                </Box>

                <Typography mt={1} variant="body2" align="right">
                    Tổng số: {total} | Trang {page}/{Math.ceil(total / pageSize)}
                </Typography>
            </>

            //    end Body---------------------------------
        )
    }
    export default StudentAdmin;