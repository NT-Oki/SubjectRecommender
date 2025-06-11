import { Box, Typography, CircularProgress, Button, TextField, Pagination, FormControl, FormHelperText, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower, } from "react-icons/gi";
import axios from 'axios';
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPenToSquare, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import {  toast } from 'react-toastify';
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
    const [searchYear, setSearchYear] = useState<Number>();
    const [searchName, setSearchName] = useState("");
    const [lastNameUpdate, setLastNameUpdate] = useState<string | null>(null);
    const [nameUpdate, setNameUpdate] = useState<string | null>(null);
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [mssvAdd, setMssvAdd] = useState<string | null>(null);
    const [lastNameAdd, setLastNameAdd] = useState<string | null>(null);
    const [nameAdd, setNameAdd] = useState<string | null>(null);
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
       // const [errorRows, setErrorRows] = useState([]);
       const [uploading, setUploading] = useState(false);
       const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    }, [page, pageSize]);
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
        if(!isMssvAddErro&&!isLastNameAddErro&&!isNameAddErro&&!isCurriculumAddErro&&!isenrollmentYearAddErro){
        try {
            const res = await axios.post(API_ENDPOINTS.ADMIN.STUDENT.USER, {
                userId: mssvAdd,
                lastName: lastNameAdd?.toLocaleUpperCase(),
                name: nameAdd?.toLocaleUpperCase(),
                enrollmentYear: enrollmentYearAdd,
                curriculumId: curriculumAdd
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data);
            setIsAdd(false);
            fetchUser();
        } catch (err: any) {
            console.log(err.response.data);

        }}else{
            console.log("dữ liệu chưa cho phép thêm sinh viên");
            
        }
    }
    const checkMssvAdd = async (e:any) => {
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
            }else{
                setIsMssvAddErro(false);
            }

        } catch (err: any) {
            console.log(err.response.data);

        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
        throw new Error("Function not implemented.")
    }
    const handleImport=()=>{

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
                    onClick={()=>{
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
                                        sx={{ width: "350px", marginTop: 2 }}
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
            {/* ////////////// */}
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
                <DialogTitle style={{ fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}>Thêm User từ file Excel</DialogTitle>
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
export default StudentAdmin;