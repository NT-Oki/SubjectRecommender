import { Box, Typography, CircularProgress, Button, Tooltip, TextField, Select, MenuItem, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio, SelectChangeEvent, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress } from "@mui/material";
import "@fontsource/quicksand/latin.css";
import "@fontsource/roboto-serif/latin.css";
import "@fontsource/roboto/latin.css";
import "@fontsource/noto-sans/latin.css";
import { GiTwirlyFlower } from "react-icons/gi";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig"; // Đảm bảo đường dẫn này đúng
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDownload, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
const ScoreAdmin = () => {
    interface UserDTO {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmentYear: number;
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
    interface ErrorRow {
        rowNumber: number;
        rowData: string[];
        errorReason: string;
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
    const token = sessionStorage.getItem("token"); // Lấy token từ sessionStorage
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
    const [errorRows, setErrorRows] = useState<ErrorRow[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [fileIdForTracking, setFileIdForTracking] = useState<string | null>(null); // Để lưu fileId cho polling

    // Sử dụng ref hoặc state để lưu trữ interval ID để có thể clear nó khi component unmount hoặc khi quá trình hoàn tất/lỗi
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);


    const fetchUserScore = async () => {
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

        // Cleanup function cho useEffect
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [page, pageSize, pollingIntervalId]); // Thêm pollingIntervalId vào dependency array

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

            toast.success("Xuất Excel thành công!"); // Sử dụng toastify
        } catch (err: any) {
            console.error("Lỗi khi xuất file:", err);
            toast.error(err.response?.data?.message || "Lỗi khi xuất file"); // Sử dụng toastify
        }
    };
    const handleEdit = async (s: Score) => {
        if (isEdit && editScoreId === s.id) { // Kiểm tra nếu đang ở trạng thái chỉnh sửa và cùng id
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
                console.log(res.data);
                
                // Cập nhật điểm và trạng thái passed trong data
                const updatedData = data?.map(item =>
                    item.id === s.id
                        ? { ...item, score: rounded, passed: rounded >= 5 ? 1 : 0 }
                        : item
                );
                setData(updatedData!);

                toast.success("Cập nhật điểm thành công!");
                setIsEdit(false);
                setEditScoreId(null);
                setScoreUpdate(-1);
            } catch (err: any) {
                console.error("Lỗi khi cập nhật điểm:", err.response?.data || err.message);
                toast.error(err.response?.data?.message || "Lỗi khi cập nhật điểm");
            }
        } else {
            setIsEdit(true);
            setEditScoreId(s.id);
            setScoreUpdate(s.score); // preload điểm cũ vào state nếu cần
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
        const name = event.target.name;
        const valueStr = event.target.value;
        setDataAdd(prev => ({
            ...prev,
            [name]: name === "semester" || name === "year" || name === "score" ? Number(valueStr) : valueStr
        }));
    };

    const handleAdd = async () => {
        try {
            const res = await axios.post(API_ENDPOINTS.ADMIN.SCORE.SCORE, dataAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Thêm điểm thành công");
            setDataAdd({
                userId: '',
                subjectId: '',
                semester: 0,
                score: 0,
                year: 0,
            });
            fetchUserScore(); // Cập nhật lại danh sách
            setIsAdd(false); // Đóng dialog thêm điểm
            console.log(res.data);
        } catch (err: any) {
            console.error("Lỗi khi thêm điểm:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Lỗi khi thêm điểm");
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
            ];
            if (allowedTypes.includes(file.type)) {
                setSelectedFile(file);
                // Reset trạng thái khi chọn file mới
                setProgress(0);
                setErrorRows([]);
                // setFileIdForTracking(null);
                // toast.success(`Đã chọn file: ${file.name}`); // Không cần toast này ở đây
            } else {
                setSelectedFile(null);
                toast.error("Vui lòng chọn file Excel hợp lệ (.xlsx hoặc .xls).");
            }
        }
    };
    const handleImport = async () => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn một file để import.");
            return;
        }

        setIsImport(false); // Đóng dialog chọn file ngay lập tức
        setUploading(true); // Mở dialog tiến trình
        setProgress(0);
        setErrorRows([]);
        // setFileIdForTracking(null);

        // Khởi tạo toastId ở đây
        let uploadToastId = toast.loading('Đang tải file lên server...');
        let progressToastId: string | number | undefined;


        try {
            // --- BƯỚC 1: UPLOAD FILE TẠM THỜI LÊN SERVER ---
            const formData = new FormData();
            formData.append("file", selectedFile);

            const resUpload = await axios.post(API_ENDPOINTS.ADMIN.UPLOADFILE, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
            });

            const fileId = resUpload.data.fileId;
            // setFileIdForTracking(fileId);
            // Cập nhật toast upload thành công
            toast.update(uploadToastId, {
                render: `Tải file "${selectedFile.name}" thành công! Bắt đầu xử lý...`,
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            // --- BƯỚC 2: KÍCH HOẠT QUÁ TRÌNH IMPORT BẤT ĐỒNG BỘ ---
            progressToastId = toast.loading('Đang xử lý import file... 0%', {
                position: 'bottom-right',
            });
            await axios.post(
                API_ENDPOINTS.ADMIN.SCORE.IMPORT,

                { fileId: fileId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // 'Content-Type': 'application/json',
                    },
                }
            );

            // --- BƯỚC 3: BẮT ĐẦU POLLING TIẾN TRÌNH ---
            const interval = setInterval(async () => {
                try {
                    const res = await axios.get(API_ENDPOINTS.ADMIN.PROGRESS, {
                        params: { fileId },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const currentProgress = res.data;
                    setProgress(currentProgress);

                    if (currentProgress < 0) { // Backend báo lỗi tổng quát (ví dụ -1)
                        clearInterval(interval);
                        setPollingIntervalId(null); // Clear interval ID
                        setUploading(false);
                        toast.update(progressToastId!, {
                            render: "Import file thất bại do lỗi xử lý trên server.",
                            type: 'error',
                            isLoading: false,
                            autoClose: 5000, // Giữ toast lỗi hiển thị
                        });
                        await fetchErrors(fileId);
                    } else if (currentProgress < 100) {
                        toast.update(progressToastId!, {
                            render: `Đang xử lý import file... ${currentProgress}%`,
                            // type: 'loading' giữ nguyên
                        });
                    } else { // currentProgress >= 100 (hoàn thành)
                        clearInterval(interval);
                        setPollingIntervalId(null); // Clear interval ID
                        setUploading(false);
                        toast.update(progressToastId!, {
                            render: "Import file hoàn tất!",
                            type: 'success',
                            isLoading: false,
                            autoClose: 5000,
                        });
                        await fetchErrors(fileId);
                        fetchUserScore(); // Cập nhật lại dữ liệu sau khi import xong
                    }
                } catch (pollingErr: any) {
                    clearInterval(interval);
                    setPollingIntervalId(null); // Clear interval ID
                    setUploading(false);
                    console.error("Lỗi khi lấy tiến trình import:", pollingErr.response?.data || pollingErr);
                    toast.update(progressToastId!, {
                        render: "Lỗi khi lấy tiến trình import. Vui lòng kiểm tra console.",
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                    });
                }
            }, 1500);
            setPollingIntervalId(interval); // Lưu interval ID vào state

        } catch (initialErr: any) {
            setUploading(false);
            console.error("Lỗi trong quá trình upload/kích hoạt import:", initialErr.response?.data || initialErr);
            toast.update(uploadToastId, { // Cập nhật toast upload với lỗi
                render: `Import file thất bại: ${initialErr.response?.data?.message || initialErr.message || 'Lỗi không xác định'}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            if (progressToastId) { // Đảm bảo toast tiến trình bị đóng nếu có lỗi ở bước đầu
                toast.dismiss(progressToastId);
            }
        }
    };

    // --- Hàm riêng để lấy chi tiết lỗi từ Backend ---
    const fetchErrors = async (fileId: string) => {
        try {
            const errorRes = await axios.get(API_ENDPOINTS.ADMIN.GET_IMPORT_ERRO, {
                params: { fileId },
                headers: { Authorization: `Bearer ${token}` },
            });
            const backendErrorRows: ErrorRow[] = errorRes.data.erroRows;
            setErrorRows(backendErrorRows);

            if (backendErrorRows && backendErrorRows.length > 0) {
                toast.warn(`Import hoàn tất nhưng có ${backendErrorRows.length} lỗi. Vui lòng kiểm tra chi tiết bên dưới.`);
            }
        } catch (err: any) {
            console.error("Lỗi khi lấy danh sách lỗi:", err.response?.data || err);
            toast.error("Lỗi khi lấy danh sách lỗi import.", { toastId: `fetch-errors-${fileId}` }); // Sử dụng ID động cho toast này
        }
    };
    const handleDownloadErroImport = async () => {
        try {
            const res = await axios.post(API_ENDPOINTS.ADMIN.EXPORT_ERRO, errorRows, {

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
            a.download = 'scoreserros.xlsx'; // Tên file khi lưu
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Giải phóng URL sau khi xong

            toast.success("Xuất Excel thành công!"); // Sử dụng toastify
        } catch (err: any) {
            console.error("Lỗi khi xuất file:", err);
            toast.error(err.response?.data?.message || "Lỗi khi xuất file"); // Sử dụng toastify
        }
    }
    return (
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
                <Select defaultValue="" displayEmpty size="small" value={searchStatus} sx={{
                    fontFamily: "sans-serif"
                }}
                    onChange={(e) => setSearchStatus(e.target.value)}
                >
                    <MenuItem sx={{ fontFamily: "sans-serif" }} value="">Kết quả</MenuItem>
                    <MenuItem value="1">Đạt</MenuItem>
                    <MenuItem value="0">Không đạt</MenuItem>
                </Select>
                <Button variant="contained"
                    onClick={handleSearchClick}
                >Tìm</Button>
                <Button variant="outlined" onClick={handleExport} sx={{ fontFamily: "sans-serif" }}>Xuất Excel</Button>
                <Button sx={{ backgroundColor: "orangered", ":hover": { backgroundColor: "ActiveBorder" } }} variant="contained" onClick={() => setIsAdd(true)}>Thêm</Button>
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
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.2}>STT</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.7}>Mã MH</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={1.4}>Tên môn học</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.7}>MSSV</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.4}>Học Kỳ</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.7}>Năm học</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.6}>Điểm</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.6}>Kết quả</Typography>
                <Typography sx={{
                    fontFamily: "sans-serif"
                }} flex={0.5}>Hành Động</Typography>

            </Box>
            {/* ///////// */}

            {isLoading ?
                (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : data && data.length > 0 ? (data.map((score: Score, index: number) => (

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
                                        value={scoreUpdate === -1 ? score.score : scoreUpdate} 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsed = parseFloat(value); 
                                            if (value.length > 5) { 
                                               
                                            } else {
                                                if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) { 
                                                    setScoreUpdate(parsed);
                                                } else {
                                                    setScoreUpdate(-1);
                                                    toast.error("Điểm không hợp lệ (0-10)");
                                                }
                                            }
                                        }}
                                        inputProps={{ min: 0, max: 10, step: 0.1 }} // Thêm max
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
                )) : (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Typography>Không có dữ liệu điểm.</Typography>
                    </Box>
                )}
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

            {/* Dialog Thêm điểm */}
            {isAdd && (
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
                            <InputLabel id="year-label">Năm học</InputLabel>
                            <Select
                                labelId="year-label"
                                id="year-select"
                                name="year"
                                value={dataAdd?.year || ''}
                                label="Năm học"
                                onChange={handleChange}
                            >
                                <MenuItem value={2020}>2020 - 2021</MenuItem>
                                <MenuItem value={2021}>2021 - 2022</MenuItem>
                                <MenuItem value={2022}>2022 - 2023</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Điểm" name="score" type="number" fullWidth margin="dense" value={dataAdd.score} onChange={handleChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsAdd(false)}>Hủy</Button>
                        <Button variant="contained" onClick={handleAdd}>Lưu</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog Import từ file Excel */}
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
                            onChange={handleFileChange}
                            disabled={uploading}
                            style={{
                                marginTop: "10px",
                                border: "1px solid #ccc",
                                padding: "6px",
                                borderRadius: "4px",
                                backgroundColor: "#e1f7d5",
                            }}
                        />
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'green' }}>
                                Đã chọn: {selectedFile.name}
                            </Typography>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsImport(false)} disabled={uploading}>Hủy</Button>
                    <Button variant="contained" onClick={handleImport} disabled={!selectedFile || uploading}>
                        Import
                    </Button>
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
                <DialogTitle style={{ fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}>Đang nhập dữ liệu điểm</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            {progress >= 0 ? `Đang xử lý: ${progress}%` : "Có lỗi xảy ra"}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {/* Nút này chỉ đóng dialog, không dừng quá trình ở backend */}
                    <Button onClick={() => setUploading(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Hiển thị bảng lỗi ở bên ngoài dialog, chỉ khi có lỗi */}
            {errorRows.length > 0 && (
                <Box sx={{ mt: 4, p: 2, border: '1px solid #dc3545', borderRadius: '8px', bgcolor: '#fff3f3' }}>
                    <Typography variant="h6" component="h3" sx={{ color: '#dc3545', mb: 2, textAlign: 'center', fontFamily: 'sans-serif' }}>
                        Chi tiết các dòng bị lỗi ({errorRows.length} lỗi):
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #eee' }}>
                        <Table stickyHeader aria-label="error rows table">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8d7da' }}>
                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Dòng</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Lý do lỗi</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Dữ liệu hàng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errorRows.map((error, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{error.rowNumber}</TableCell>
                                        <TableCell>{error.errorReason}</TableCell>
                                        <TableCell>{error.rowData ? error.rowData.join(', ') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        sx={{
                            fontFamily: 'sans-serif',
                            ":hover": {
                                backgroundColor: 'greenyellow',
                                borderRadius: "15px",

                            }
                        }}
                        onClick={handleDownloadErroImport}
                        startIcon={<FontAwesomeIcon icon={faDownload} size="2x" color="orange" />}
                    >Tải file</Button>
                </Box>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
};

export default ScoreAdmin;