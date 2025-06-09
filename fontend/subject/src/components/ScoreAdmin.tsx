import { Box, Typography, CircularProgress, Button, Tooltip, TextField, Select, MenuItem, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio, SelectChangeEvent } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower, } from "react-icons/gi";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
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
    interface ScoreAdd {
        userId: string;
        subjectId: string;
        semester: number;
        score: number;
        year: number;
    }


    const [data, setData] = useState<Score[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [total, setTotal] = useState(0);
    const [searchUserId, setSearchUserId] = useState("");
    const [searchSemester, setSearchSemester] = useState("");
    const [searchSubjectName, setSearchSubjectName] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const token = sessionStorage.getItem("token");
    const [scoreUpdate, setScoreUpdate] = useState<number>(-1);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [editScoreId, setEditScoreId] = useState<number | null>(null);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [dataAdd, setDataAdd] = useState<ScoreAdd>({
        userId: '',
        subjectId: '',
        semester: 0,
        score: 0,
        year: 0,
    });
    const [isImport, setIsImport] = useState<boolean>(false);
    const [progress, setProgress] = useState(0);
    // const [errorRows, setErrorRows] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);



    const fetchUserScore = async () => {

        // const userId = sessionStorage.getItem("userId");

        try {
            setIsLoading(true);
            const response = await axios.get(API_ENDPOINTS.ADMIN.SCORE.LISTSCORE, {
                params: {
                    page: page - 1,
                    size: pageSize,
                    userId: searchUserId || undefined,
                    subjectName: searchSubjectName || undefined,
                    semester: searchSemester ? parseInt(searchSemester) : undefined,
                    status: searchStatus || undefined
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            setData(response.data.scores);
            setTotal(response.data.total);
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
            const res = await axios.get(API_ENDPOINTS.ADMIN.SCORE.EXPORT, {
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
            a.download = 'scores.xlsx'; // Tên file khi lưu
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Giải phóng URL sau khi xong

            alert("Xuất Excel thành công!");
        } catch (err: any) {
            alert(err.response?.data || "Lỗi khi xuất file");
        }
    };
    const handleEdit = async (s: Score) => {
        if (isEdit) {
            const rounded = Math.round(scoreUpdate * 10) / 10;

            try {
                const res = await axios.put(API_ENDPOINTS.ADMIN.SCORE.SCORE, {
                    id: s.id,
                    score: rounded
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                s.score = rounded ?? s.score;
                if (rounded >= 5) {
                    s.passed = 1;
                } else {
                    s.passed = 0;
                }
                console.log(res.data);
                setIsEdit(false);
                setEditScoreId(null);
                setScoreUpdate(-1);
            } catch (err: any) {
                console.log(err.response?.data || err.message);
            }
        } else {
            setIsEdit(true);
            setEditScoreId(s.id);
            setScoreUpdate(s.score); // preload điểm cũ vào state nếu cần
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
        const name = event.target.name;
        const valueStr = event.target.value; // string
        const value = Number(valueStr); // chuyển sang số nếu cần
        setDataAdd(prev => ({
            ...prev,
            [name]: name === "semester" || name === "year" || name === "score" ? Number(value) : value
        }));
    };

    const handleAdd = async () => {
        try {
            const res = await axios.post(API_ENDPOINTS.ADMIN.SCORE.SCORE, dataAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Thêm điểm thành công");
            setDataAdd({
                userId: '',
                subjectId: '',
                semester: 0,
                score: 0,
                year: 0,
            });
            fetchUserScore(); // Cập nhật lại danh sách
            console.log(res.data);
        } catch (err: any) {
            alert(err.response?.data || "Lỗi khi thêm điểm");
        }
    };
    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleImport = async () => {
        // const file = e.target.files[0];
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const resUpload = await axios.post(API_ENDPOINTS.ADMIN.UPLOADFILE, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fileId = resUpload.data.fileId;
            const path = resUpload.data.filePath;
            try {
                const res = await axios.post(
                    API_ENDPOINTS.ADMIN.SCORE.IMPORT,
                    { fileId, path }, // gửi đúng body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        },
                    }
                );
                // setErrorRows(res.data.erroRows);
                console.log(res.data.erroRows);
                
            } catch (err: any) {
                console.error(err.response.data);
                setUploading(false);
                return;

            }

            const interval = setInterval(async () => {
                try {
                    const res = await axios.get(API_ENDPOINTS.ADMIN.PROGRESS, {
                        params: { fileId },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setProgress(res.data);
                    if (res.data >= 100) {
                        clearInterval(interval);
                        setUploading(false);
                    }
                } catch (err) {
                    clearInterval(interval);
                    setUploading(false);
                    console.error("Lỗi khi lấy tiến trình import:", err);
                }
            }, 500);
        } catch (err: any) {
            setUploading(false);
            console.error("Lỗi khi upload file:", err);

        }

    };

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
            <Box display="flex" gap={2} mb={2} mt={2} justifyContent={"center"}>
                <TextField label="Mã SV" size="small"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)} />
                <Select
                    defaultValue=""
                    displayEmpty
                    size="small"
                    value={searchSemester}
                    onChange={(e) => setSearchSemester(e.target.value)}>
                    <MenuItem value="">Học kỳ</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                </Select>
                <TextField
                    label="Môn"
                    size="small"
                    value={searchSubjectName}
                    onChange={(e) => setSearchSubjectName(e.target.value)} />
                <Select defaultValue="" displayEmpty size="small" value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                >
                    <MenuItem value="">Kết quả</MenuItem>
                    <MenuItem value="1">Đạt</MenuItem>
                    <MenuItem value="0">Không đạt</MenuItem>
                </Select>
                <Button variant="contained"
                    onClick={handleSearchClick}
                >Tìm</Button>
                <Button variant="outlined" onClick={handleExport}>Xuất Excel</Button>
                <Button sx={{ backgroundColor: "orangered" }} variant="contained" onClick={() => setIsAdd(true)}>Thêm</Button>
                <Button variant="contained" color="success" onClick={() => {
                    setIsImport(true);
                }}>Import</Button>
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
                <Typography flex={1.4}>Tên môn học</Typography>
                <Typography flex={0.7}>MSSV</Typography>
                <Typography flex={0.4}>Học Kỳ</Typography>
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
                            <Typography flex={0.2}>{(page - 1) * pageSize + index + 1}</Typography>
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
                                <Typography sx={{ flex: "0.7", cursor: "pointer" }}>
                                    {score.subject.id}
                                </Typography>
                            </Tooltip>
                            <Typography flex={1.4}>{score.subject.subjectName}</Typography>

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
                            <Typography flex={0.4}>{score.semester}</Typography>
                            <Typography flex={0.7}>{score.year} - {score.year + 1}</Typography>
                            <Typography flex={0.6}>
                                {editScoreId === score.id ? (
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={scoreUpdate ?? score.score}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsed = Number(value);
                                            if (value.length > 5) {
                                                scoreUpdate ?? score.score
                                            } else {
                                                if (!isNaN(parsed) && parsed < 11) {
                                                    setScoreUpdate(parsed);
                                                } else {
                                                    scoreUpdate ?? score.score
                                                }
                                            }
                                        }}
                                        inputProps={{ min: 0, step: 0.1 }}
                                    />
                                ) : (score.score)}
                            </Typography>

                            <Typography flex={0.6}>{score.passed == 1 ? "Đạt" : "Không Đạt"}</Typography>
                            <Box
                                flex={0.5}
                            >
                                <Button
                                    onClick={() => handleEdit(score)}
                                    size="small"
                                    variant="outlined"
                                    color={editScoreId === score.id ? "success" : "primary"}
                                >
                                    <FontAwesomeIcon icon={editScoreId === score.id ? faCheck : faPenToSquare} />
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
            {isAdd ? (
                <Dialog open={isAdd} onClose={() => setIsAdd(false)}
                    slotProps={{
                        paper: {
                            sx: {
                                bgcolor: "#e1f7d5",
                                width: "400px"
                            }
                        }
                    }}
                >
                    <DialogTitle>Thêm điểm môn học</DialogTitle>
                    <DialogContent>
                        <TextField label="User ID" name="userId" fullWidth margin="dense" value={dataAdd.userId} onChange={handleChange} />
                        <TextField label="Subject ID" name="subjectId" fullWidth margin="dense" value={dataAdd.subjectId} onChange={handleChange} />
                        <FormControl fullWidth margin="dense">
                            <FormLabel id="semester-label" sx={{ mb: 1 }}>
                                Học kỳ
                            </FormLabel>
                            <Box display="flex" justifyContent="center">
                                <RadioGroup
                                    row
                                    aria-labelledby="semester-label"
                                    name="semester"
                                    value={dataAdd.semester.toString()}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="HK1" />
                                    <FormControlLabel value="2" control={<Radio />} label="HK2" />
                                </RadioGroup>
                            </Box>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="year-label">Year</InputLabel>
                            <Select
                                labelId="year-label"
                                id="year-select"
                                name="year"
                                value={dataAdd?.year || ''}
                                label="Year"
                                onChange={handleChange}
                            >
                                <MenuItem value={2020}>2020 - 2021</MenuItem>
                                <MenuItem value={2021}>2021 - 2022</MenuItem>
                                <MenuItem value={2022}>2022 - 2023</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Score" name="score" type="number" fullWidth margin="dense" value={dataAdd.score} onChange={handleChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsAdd(false)}>Hủy</Button>
                        <Button variant="contained" onClick={handleAdd}>Lưu</Button>
                    </DialogActions>
                </Dialog>

            ) : null}
            <Dialog open={isImport} onClose={() => setIsImport(false)}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: "#e1f7d5",
                            width: "400px"
                        }
                    }
                }}
            >
                <DialogTitle style={{ fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}>Thêm điểm từ file Excel</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel shrink htmlFor="import-file-input">
                            Chọn file Excel để thêm dữ liệu
                        </InputLabel>
                        <input
                            id="import-file-input"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e)}
                            style={{
                                marginTop: "10px",
                                border: "1px solid #ccc",
                                padding: "6px",
                                borderRadius: "4px",
                                backgroundColor: "#e1f7d5",
                            }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsImport(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleImport} >Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={uploading} onClose={() => setUploading(false)}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: "#e1f7d5",
                            width: "400px"
                        }
                    }
                }}
            >
                <DialogTitle style={{ fontFamily: "sans-serif" }}>Đang nhập dữ liệu điểm{progress} </DialogTitle>
                <DialogContent>
                    {/* <Label>Đang xử lí: {progress} %</Label> */}
                    <progress value={progress} max={100}/>
                        
                    {/* <LinearProgress variant="determinate" value={progress} /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploading(false)}>Hủy</Button>
                </DialogActions>
            </Dialog>

        </>

        //    end Body---------------------------------
    )
}
export default ScoreAdmin;