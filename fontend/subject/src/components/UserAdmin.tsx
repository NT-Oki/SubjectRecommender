import { Box, Typography, CircularProgress, Button, TextField, Pagination, FormControl, FormHelperText, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormLabel, RadioGroup, Radio, FormControlLabel, TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody, LinearProgress } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower, } from "react-icons/gi";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDownload, faPenToSquare, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify';
const StudentAdmin = () => {
    interface UserDTO {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmentYear: number;
    }
    interface ErrorRow {
        rowNumber: number;
        rowData: string[];
        errorReason: string;
    }
    const token = sessionStorage.getItem("token");
    const [data, setData] = useState<UserDTO[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [total, setTotal] = useState(0);
    const [searchUserId, setSearchUserId] = useState("");
    const [searchYear, setSearchYear] = useState<Number>();
    const [searchName, setSearchName] = useState("");
    const [lastNameUpdate, setLastNameUpdate] = useState<string | null>(null);
    const [nameUpdate, setNameUpdate] = useState<string | null>(null);
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [mssvAdd, setMssvAdd] = useState<string | null>(null);
    const [lastNameAdd, setLastNameAdd] = useState<string | null>(null);
    const [nameAdd, setNameAdd] = useState<string | null>(null);
    const [roleAdd, setRoleAdd] = useState<number>(2);
    const [enrollmentYearAdd, setEnrollmentYearAdd] = useState<number | null>(2020);
    const [curriculumAdd, setCurriculumAdd] = useState<string | null>("7480201_2020");
    const [mssvAddErro, setMssvAddErro] = useState<string | null>(null);
    const [lastNameAddErro, setLastNameAddErro] = useState<string | null>(null);
    const [nameAddErro, setNameAddErro] = useState<string | null>(null);
    const years = Array.from({ length: 2 }, (_, i) => 2020 + i);
    const [isenrollmentYearAddErro, setIsenrollmentYearAddErro] = useState<boolean>(false);
    const [isMssvAddErro, setIsMssvAddErro] = useState<boolean>(true);
    const [isLastNameAddErro, setIsLastNameAddErro] = useState<boolean>(true);
    const [isNameAddErro, setIsNameAddErro] = useState<boolean>(true);
    const [isCurriculumAddErro, setIsCurriculumAddErro] = useState<boolean>(false);
    const [isImport, setIsImport] = useState<boolean>(false);
    const [progress, setProgress] = useState(0);
    const [errorRows, setErrorRows] = useState<ErrorRow[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);
    const fetchUser = async () => {

        // const userId = sessionStorage.getItem("userId");

        try {
            setIsLoading(true);
            const response = await axios.get(API_ENDPOINTS.ADMIN.STUDENT.LISTUSER, {
                params: {
                    page: page - 1,
                    size: pageSize,
                    userId: searchUserId || undefined,
                    userName: searchName || undefined,
                    year: searchYear || undefined,
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
            fetchUser();
    
            // Cleanup function cho useEffect
            return () => {
                if (pollingIntervalId) {
                    clearInterval(pollingIntervalId);
                }
            };
        }, [page, pageSize, pollingIntervalId]); // Thêm pollingIntervalId vào dependency array
    const handleSearchClick = () => {
        setPage(1); // Quay về trang 1 khi tìm kiếm mới
        fetchUser();
    };
    const handleExport = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.STUDENT.EXPORT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
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
    const handleEdit = async (u: UserDTO) => {
        if (editUserId != null) {
            try {
                const res = await axios.put(API_ENDPOINTS.ADMIN.STUDENT.USER, {
                    id: u.id,
                    lastName: lastNameUpdate,
                    name: nameUpdate,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                u.lastName = lastNameUpdate ?? u.lastName;
                u.name = nameUpdate ?? u.name;
                console.log(res.data);
                setEditUserId(null);
                setLastNameUpdate(null);
                setNameUpdate(null);
            } catch (err: any) {
                console.log(err.response?.data || err.message);
            }
        } else {
            setEditUserId(u.id);
            setLastNameUpdate(u.lastName);
            setNameUpdate(u.name);
        }
    };


    const handleAdd = async () => {
        if (!isMssvAddErro && !isLastNameAddErro && !isNameAddErro && !isCurriculumAddErro && !isenrollmentYearAddErro) {
            try {
                const res = await axios.post(API_ENDPOINTS.ADMIN.STUDENT.USER, {
                    userId: mssvAdd,
                    lastName: lastNameAdd?.toLocaleUpperCase(),
                    name: nameAdd?.toLocaleUpperCase(),
                    enrollmentYear: enrollmentYearAdd,
                    curriculumId: curriculumAdd,
                    role: roleAdd
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res.data);
                setIsAdd(false);

                fetchUser();
                toast.success("Thêm 1 " + `${roleAdd == 2 ? "sinh viên" : "giảng viên"}` + " thành công")
            } catch (err: any) {
                console.log(err.response.data);
                toast.success("Thêm 1 " + `${roleAdd == 2 ? "sinh viên" : "giảng viên"}` + " thất bại")

            }
        } else {
            console.log("dữ liệu chưa cho phép thêm sinh viên");

        }
    }
    const checkMssvAdd = async (e: any) => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.STUDENT.CHECKEXIST, {
                params: {
                    userId: e.target.value
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.data == true) {
                setMssvAddErro("Mã số sinh viên đã tồn tại")
                setIsMssvAddErro(true);
            } else {
                setIsMssvAddErro(false);
            }

        } catch (err: any) {
            console.log(err.response.data);

        }
    }
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
        setSelectedFile(null);
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
                API_ENDPOINTS.ADMIN.STUDENT.IMPORT,

                {
                    fileId: fileId,
                    role: roleAdd,
                    curriculumVersion: curriculumAdd
                },
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
                        fetchUser(); // Cập nhật lại dữ liệu sau khi import xong
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
            }, 1000);
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
            a.download = 'userImportErro.xlsx'; // Tên file khi lưu
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
                    onClick={() => {
                        handleSearchClick();
                        toast.success("okeeeeeeeeeee");
                    }}
                >Tìm</Button>
                <Button variant="outlined" onClick={handleExport}>Xuất Excel</Button>
                <Button sx={{ backgroundColor: "orangered" }} variant="contained" onClick={() => {
                    setIsAdd(true);

                }}>Thêm</Button>
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
                            {/* <Typography flex={1}>{user.lastName}</Typography> */}
                            <Typography flex={1}>
                                {editUserId === user.id ? (
                                    <TextField
                                        size="small"
                                        type="text"
                                        value={lastNameUpdate ?? user.lastName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setLastNameUpdate(value);
                                        }}
                                        inputProps={{ min: 0, step: 0.1, maxlength: 25 }}
                                    />
                                ) : (user.lastName)}
                            </Typography>
                            {/* <Typography flex={0.5}>{user.name}</Typography> */}
                            <Typography flex={0.5}>
                                {editUserId === user.id ? (
                                    <TextField
                                        size="small"
                                        type="text"
                                        value={nameUpdate ?? user.name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNameUpdate(value);
                                        }}

                                        inputProps={{ min: 0, step: 0.1, maxlength: 7 }}
                                    />
                                ) : (user.name)}
                            </Typography>
                            <Typography flex={1}>{user.major}</Typography>
                            <Typography flex={0.5}>{user.enrollmentYear}</Typography>
                            <Box
                                flex={0.5}
                            >
                                <Button
                                    onClick={() => handleEdit(user)}
                                    size="small"
                                    variant="outlined"
                                    color={editUserId === user.id ? "success" : "primary"}
                                >
                                    <FontAwesomeIcon icon={editUserId === user.id ? faCheck : faPenToSquare} />
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
                                    width: "350px",
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
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} color="orange" style={{ fontSize: '30px', verticalAlign: 'middle' }} />
                                    <Typography sx={{ fontSize: "25px", fontFamily: "sans-serif", fontWeight: "bold", alignContent: "center" }}>

                                        Thêm sinh viên
                                    </Typography>
                                </Box>

                                {/* Form nhập mssv */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <FormControl
                                        error={isMssvAddErro}
                                        sx={{
                                            width: "350px",
                                        }}
                                    >
                                        <TextField
                                            label="MSSV"
                                            name="mssvAdd"
                                            fullWidth margin="dense"
                                            value={mssvAdd}
                                            onChange={(e) => {

                                                const input = e.target.value;

                                                // Chỉ cho phép ký tự số (0-9)
                                                if (/^\d*$/.test(input)) {
                                                    // Giới hạn độ dài tối đa là 8
                                                    if (input.length < 8) {
                                                        setMssvAdd(input);
                                                        setMssvAddErro(null); // Xóa lỗi nếu có


                                                    } else if (input.length === 8) {
                                                        setMssvAdd(input);
                                                        checkMssvAdd(e); // Gọi kiểm tra khi đủ 8 ký tự
                                                    }
                                                    else {
                                                        // Nếu nhập quá 8 số
                                                        setMssvAdd(input.slice(0, 8));
                                                        setMssvAddErro("Giá trị bắt buộc 8 kí tự số");
                                                    }
                                                } else {
                                                    // Nếu nhập ký tự không phải số
                                                    setMssvAdd(mssvAdd);
                                                    setMssvAddErro("Chỉ được nhập chữ số (0-9)");
                                                }
                                            }}


                                        />
                                        <FormHelperText>{mssvAddErro}</FormHelperText>
                                    </FormControl>
                                </Box>
                                {/* Form nhập lastName */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <FormControl
                                        error={isLastNameAddErro}
                                        sx={{
                                            width: "350px",
                                        }}
                                    >
                                        <TextField
                                            label="Họ và tên đệm"
                                            name="lastNameAddd"
                                            fullWidth
                                            margin="dense"
                                            value={lastNameAdd}

                                            onBlur={(e) => {
                                                const input = e.target.value;
                                                if (input.length < 2) {
                                                    setLastNameAddErro("Tên hợp lệ phải chứa ít nhất 2 kí tự");
                                                    setLastNameAdd(input);
                                                    setIsLastNameAddErro(true);
                                                } else if (input.length == 25) {
                                                    setLastNameAddErro(null);
                                                    setIsLastNameAddErro(false);
                                                }
                                            }}
                                            onChange={(e) => {
                                                const input = e.target.value;

                                                if (input.length > 25) {
                                                    setLastNameAddErro("Tên hợp lệ phải ngắn hơn 26 ký tự");
                                                    setLastNameAdd(input.substring(0, 25));
                                                    setIsLastNameAddErro(false);
                                                } else if (input.length < 2) {
                                                    setLastNameAddErro("Tên hợp lệ phải chứa ít nhất 2 kí tự");
                                                    setLastNameAdd(input);
                                                    setIsLastNameAddErro(true);
                                                } else {
                                                    setLastNameAddErro(null);
                                                    setLastNameAdd(input);
                                                    setIsLastNameAddErro(false);
                                                }
                                            }}
                                        />
                                        <FormHelperText>{lastNameAddErro}</FormHelperText>
                                    </FormControl>
                                </Box>
                                {/* Form nhập name */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <FormControl
                                        error={isNameAddErro}
                                        sx={{
                                            width: "350px",
                                        }}
                                    >
                                        <TextField
                                            label="Tên"
                                            name="nameAdd"
                                            fullWidth
                                            margin="dense"
                                            value={nameAdd}
                                            onBlur={(e) => {
                                                const value = nameAdd;
                                                const input = e.target.value;
                                                if (input.length < 1) {
                                                    setNameAddErro("Tên hợp lệ phải chứa ít nhất 1 kí tự");
                                                    setNameAdd(value);
                                                    setIsNameAddErro(true);
                                                } else if (input.length == 7) {
                                                    setNameAddErro(null);
                                                    setIsNameAddErro(false);
                                                }
                                            }}
                                            onChange={(e) => {
                                                const value = nameAdd;
                                                const input = e.target.value;

                                                if (input.length > 7) {
                                                    setNameAddErro("Tên hợp lệ phải ngắn hơn 8 ký tự");
                                                    setNameAdd(input.substring(0, 7));
                                                    setIsNameAddErro(false);
                                                } else if (input.length < 1) {
                                                    setNameAddErro("Tên hợp lệ phải chứa ít nhất 1 kí tự");
                                                    setNameAdd(input);
                                                    setIsNameAddErro(true);

                                                }
                                                else if (input.includes(" ")) {
                                                    setNameAddErro("Tên hợp lệ không được chứa khoảng trống");
                                                    setNameAdd(value);
                                                    setIsNameAddErro(false);

                                                } else {
                                                    setIsNameAddErro(false);
                                                    setNameAddErro(null);
                                                    setNameAdd(input);
                                                }
                                            }}
                                        />
                                        <FormHelperText>{nameAddErro}</FormHelperText>
                                    </FormControl>
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
                                        error={isenrollmentYearAddErro}
                                    >
                                        <InputLabel id="year-select-label">Năm nhập học</InputLabel>
                                        <Select
                                            labelId="year-select-label"
                                            value={enrollmentYearAdd}
                                            onChange={(e) => {
                                                setEnrollmentYearAdd(Number(e.target.value))
                                                setIsenrollmentYearAddErro(false);

                                            }}
                                            label="Năm nhập học"
                                        >
                                            {years.map((y) => (
                                                <MenuItem key={y} value={y}>
                                                    {y}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {/* <FormHelperText>{enrollmentYearAddErro}</FormHelperText> */}
                                    </FormControl>
                                </Box>
                                {/* ////Role */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <FormControl
                                        sx={{ width: "350px", marginTop: 1 }}
                                    >
                                        <FormLabel id="radio-group-label">Chọn vai trò</FormLabel> {/* Nhãn cho nhóm radio */}
                                        <RadioGroup
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row"
                                            }}
                                            aria-labelledby="radio-group-label"
                                            name="radio-buttons-group"
                                            value={roleAdd}
                                            onChange={(e) => setRoleAdd(Number(e.target.value))}
                                        >
                                            {/* Tùy chỉnh các giá trị và nhãn cho radio button của bạn */}
                                            <FormControlLabel value="2" control={<Radio />} label="Sinh viên" />
                                            <FormControlLabel value="1" control={<Radio />} label="Giảng viên" />
                                            {/* Bạn có thể thêm các FormControlLabel khác nếu cần nhiều hơn 2 giá trị */}
                                        </RadioGroup>
                                        {/* {isError && <FormHelperText>Vui lòng chọn một giá trị</FormHelperText>} */}
                                    </FormControl>
                                </Box>
                                {/* Chương trình đào tạo */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <FormControl
                                        sx={{ width: "350px", marginTop: 1 }}
                                        error={isCurriculumAddErro}
                                    >
                                        <InputLabel id="year-select-label">Chương trình đào tạo</InputLabel>
                                        <Select
                                            labelId="year-select-label"
                                            value={curriculumAdd}
                                            onChange={(e) => {
                                                setCurriculumAdd(e.target.value)
                                                setIsCurriculumAddErro(false);
                                            }}
                                            label="Chương trình đào tạo"
                                        >
                                            <MenuItem value={"7480201_2020"}>
                                                7480201_2020 (từ năm 2020)
                                            </MenuItem>
                                        </Select>
                                        {/* <FormHelperText>{enrollmentYearAddErro}</FormHelperText> */}
                                    </FormControl>
                                </Box>
                                {/* Button hành động */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 2,
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
            {/* ////////////// */}
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
                <DialogTitle style={{ fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}>Thêm user từ file Excel</DialogTitle>
                <DialogContent>
                    {/* ////Role */}
                    <Box
                        sx={{
                            display: "flex",
                            margin: "10px",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <FormControl
                            sx={{ width: "350px" }}
                        >
                            <FormLabel id="radio-group-label">Chọn vai trò</FormLabel> {/* Nhãn cho nhóm radio */}
                            <RadioGroup
                                sx={{
                                    display: "flex",
                                    flexDirection: "row"
                                }}
                                aria-labelledby="radio-group-label"
                                name="radio-buttons-group"
                                value={roleAdd}
                                onChange={(e) => setRoleAdd(Number(e.target.value))}
                            >
                                {/* Tùy chỉnh các giá trị và nhãn cho radio button của bạn */}
                                <FormControlLabel value="2" control={<Radio />} label="Sinh viên" />
                                <FormControlLabel value="1" control={<Radio />} label="Giảng viên" />
                                {/* Bạn có thể thêm các FormControlLabel khác nếu cần nhiều hơn 2 giá trị */}
                            </RadioGroup>
                            {/* {isError && <FormHelperText>Vui lòng chọn một giá trị</FormHelperText>} */}
                        </FormControl>
                    </Box>
                    {/* Chương trình đào tạo */}
                    <Box
                        sx={{
                            display: "flex",
                            margin: "10px",
                            justifyContent: "space-between",
                            alignItems: "center",

                        }}
                    >
                        <FormControl
                            sx={{ width: "350px", marginTop: 1 }}
                            error={isCurriculumAddErro}
                        >
                            <InputLabel id="year-select-label">Chương trình đào tạo</InputLabel>
                            <Select
                                labelId="year-select-label"
                                value={curriculumAdd}
                                onChange={(e) => {
                                    setCurriculumAdd(e.target.value)
                                    setIsCurriculumAddErro(false);
                                }}
                                label="Chương trình đào tạo"
                            >
                                <MenuItem value={"7480201_2020"}>
                                    7480201_2020 (từ năm 2020)
                                </MenuItem>
                            </Select>
                            {/* <FormHelperText>{enrollmentYearAddErro}</FormHelperText> */}
                        </FormControl>
                    </Box>
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

        </>


        //    end Body---------------------------------
    )
}
export default StudentAdmin;