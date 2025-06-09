import { Box, Typography, CircularProgress, TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower } from "react-icons/gi";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus, faXmark } from "@fortawesome/free-solid-svg-icons"
const CurriculumAdmin = () => {
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
    interface SubjectDTO {
        subject: Subject;
        preSubject: Subject[];
    }
    interface CurriculumVersion {
        id: string;
        major: string;
        versionName: string;
        effectiveYear: number;
    }
    interface CurriculumCourse {
        id: number;
        curriculum: CurriculumVersion;
        subject: SubjectDTO;
        semester: number;
        year: number;
        required: number;
    }

    type DataType = {
        [key: string]: CurriculumCourse[];
    };
    // const years = Array.from({ length: 2 }, (_, i) => 2020 + i);
    const token = sessionStorage.getItem("token");
    const [data, setData] = useState<DataType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchSubjectId, setSearchSubjectId] = useState<string>("");
    const [searchCurriculumVersion, setSearchCurriculumVersion] = useState<string | null>("7480201_2020");
    const [isAdd, setIsAdd] = useState<boolean>(true);
    // const [versionNameAdd, setVersionNameAdd] = useState<string>("");
    useEffect(() => {
        const fetchUserScore = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(API_ENDPOINTS.ADMIN.CURRICULUM.LIST, {
                    params: {
                        curriculumId: searchCurriculumVersion,
                        subjectSearch: searchSubjectId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setData(response.data.listCurriculumCourse);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserScore();
    }, [searchSubjectId, searchCurriculumVersion]);



    const handleExport = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.CURRICULUM.EXPORT, {
                params: {
                    curriculumId: searchCurriculumVersion,
                    subjectSearch: searchSubjectId
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', //BẮT BUỘC: để axios hiểu đây là file
            });

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'curriculum_' + searchCurriculumVersion + '.xlsx'; // Tên file khi lưu
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Giải phóng URL sau khi xong
            alert("Xuất Excel thành công!");
        } catch (err: any) {
            alert(err.response?.data || "Lỗi khi xuất file");
        }
    };


    function handleAdd(): void {
        throw new Error("Function not implemented.")
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
                    CHƯƠNG TRÌNH ĐÀO TẠO
                </Typography>
            </Box>
            <Box display="flex" gap={2} mb={2} mt={2} justifyContent={"center"}>
                <TextField label="Mã môn học" size="small"
                    value={searchSubjectId}
                    onChange={(e) => {
                        setSearchSubjectId(e.target.value)

                    }} />
                <FormControl size="small" sx={{ width: "200px", borderTop: 0 }}>
                    <InputLabel id="curriculum-select-label" shrink>Chương trình đào tạo</InputLabel>
                    <Select
                        labelId="curriculum-select-label"
                        value={searchCurriculumVersion}
                        onChange={(e) => setSearchCurriculumVersion(e.target.value)}
                    >
                        <MenuItem value="7480201_2020">7480201_2020</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={handleExport}>Xuất Excel</Button>
                <Button sx={{ backgroundColor: "orangered" }} variant="contained" onClick={() => { }}>Thêm</Button>
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
                        // fontWeight: "bold",
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
                <Typography flex={2}>Chuyên ngành</Typography>
                <Typography flex={0.6}>Số tín chỉ</Typography>
                <Typography flex={1}>Môn tiên quyết</Typography>
                <Typography flex={1}>Nhóm môn học</Typography>
            </Box>
            {/* ///////// */}

            {isLoading ?
                (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : data ? (Object.entries(data).map(([key, list]) => (

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
                        {list.map((curriculumCourse: CurriculumCourse, index: any) => (
                            <Box
                                key={curriculumCourse?.id || index}
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
                                <Typography flex={1}>{curriculumCourse.subject.subject.id}</Typography>
                                <Typography flex={2}>{curriculumCourse.subject.subject.subjectName}</Typography>
                                <Typography flex={2}>{curriculumCourse.curriculum.major}</Typography>
                                <Typography flex={0.6}>{curriculumCourse.subject.subject.credit}</Typography>
                                <Typography flex={1}>{curriculumCourse.subject.preSubject.map((s: Subject) => s.id).join(", ")}</Typography>
                                <Typography flex={1}>{curriculumCourse.subject.subject.subjectGroup.id}</Typography>

                            </Box>
                        ))}
                    </Fragment>)
                )) : null
            }
            {
                isAdd && (
                    <>
                        {/* Lớp nền mờ phía sau */}
                        <Box
                            sx={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 999,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Popup chính */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: "400px",
                                    bgcolor: '#e1f7d5',
                                    border: '1px solid rgb(59, 216, 93)',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    zIndex: 1000,
                                    p: 3,
                                }}
                            >
                                {/* Nút đóng góc phải */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        // width:"20px"
                                    }}
                                >
                                    <Button
                                        onClick={() => setIsAdd(false)}
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        sx={{
                                            ":hover": {
                                                backgroundColor: "red",
                                                color: "white"
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} size="2x" />
                                    </Button>
                                </Box>

                                {/* Header */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 2,
                                        mb: 2,
                                        mt: 2,
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSquarePlus} color="orange" style={{ fontSize: '30px', verticalAlign: 'middle' }} />
                                    <Typography sx={{ fontSize: "25px", fontFamily: "sans-serif", fontWeight: "bold", alignContent: "center" }}>
                                        Thêm chương trình đào tạo
                                    </Typography>
                                </Box>
                               
                                 {/* năm nhập học */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <FormControl
                                        sx={{ width: "350px", marginTop: 2 }}
                                        error={isAdd}
                                    >
                                        <InputLabel id="year-select-label">Áp dụng từ năm</InputLabel>
                                        <Select
                                            labelId="year-select-label"
                                            value={isAdd}
                                            onChange={() => {

                                            }}
                                            label="Năm nhập học"
                                        >

                                            <MenuItem value={"2023"}>
                                                2023
                                            </MenuItem>
                                        </Select>
                                        {/* <FormHelperText>{enrollmentYearAddErro}</FormHelperText> */}
                                    </FormControl>
                                </Box>
                               
                                {/* Chọn file Excel */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel shrink htmlFor="import-file-input">
                                            Chọn file Excel để thêm dữ liệu
                                        </InputLabel>
                                        <input
                                            id="import-file-input"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // giả sử bạn có state này
                                                }
                                            }}
                                            style={{
                                                marginTop: "10px",
                                                border: "1px solid #ccc",
                                                padding: "6px",
                                                borderRadius: "4px",
                                                backgroundColor: "#e1f7d5",
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Button hành động */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 3,
                                    }}
                                >
                                    <Button
                                        onClick={handleAdd} // hoặc hàm xử lý đổi mật khẩu
                                        variant="contained"
                                        color="success"
                                        sx={{
                                            fontFamily: "unset"
                                        }}
                                    >
                                        Thêm
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )
            }
        </>

        //    end Body---------------------------------
    )
}
export default CurriculumAdmin;