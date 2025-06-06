import { Box, Button, Typography, Input, FormControl, FormHelperText, } from "@mui/material"
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faCircleExclamation, faXmark, faLock, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import API_ENDPOINTS from "../config/apiConfig";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const menuItems = [
    { id: "score", label: "Quản lý điểm" },
    { id: "student", label: "Quản lý sinh viên" },
    { id: "subject", label: "Quản lý chương trình đào tạo" },
];

const InformationAdmin = () => {
    interface User {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmentYear: number;
    }
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [hiddenChangePass, setHiddenChangePass] = useState<boolean>(true);
    const [newPassWord, setNewPassWord] = useState("");
    const [preNewPassWord, setPreNewPassWord] = useState("");
    const [newPassWordErro, setNewPassWordErro] = useState("");
    const [preNewPassWordErro, setPreNewPassWordErro] = useState("");
    const [isNewPassWordOK, setIsNewPassWordOK] = useState(false);
    const [isPreNewPassWordOK, setIsPreNewPassWordOK] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [isHiddenNoticeChangePassWord, setIsHiddenNoticeChangePassWord] = useState(true);
    const [erroChangePassWord, setErroChangePassWord] = useState("");
    const [statusChangePassWord, setStatusChangePassWord] = useState<Number>(0);
    const [selectedItem, setSelectedItem] = useState("score");
    const selectItem = (s: string) => {
        setSelectedItem(s);
        if (s === "score") {
            navigate("/admin/score")
        } else if (s === "subject") {
            navigate("/admin/subject")
        } else if (s === "student") {
            navigate("/admin/student")
        }
    }
    useEffect(() => {
        const fetchUserScore = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.INFO, {
                    params: {
                        userId: `${userId}`,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setUser(response.data);
                // setHasToken(true);
            } catch (error: any) {
                console.error("Lỗi khi lấy thông tin user:", error);
                // if (error.response?.status === 401 || error.response?.status === 403) {
                //     sessionStorage.removeItem("token");
                //     sessionStorage.removeItem("userId");
                // setHasToken(false);
                // navigate("/");
                // }
            }
        };


        fetchUserScore();
    }, []);

    const checkPreNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPreNewPassWord(value);
        if (newPassWord === "") {
            setPreNewPassWordErro("Vui lòng nhập mật khẩu trước");
            setIsNewPassWordOK(false);
            return; // dừng luôn nếu chưa nhập mật khẩu chính
        }

        if (!checkIsSamePassWord(value, newPassWord)) {
            setIsPreNewPassWordOK(false);
            setPreNewPassWordErro("Mật khẩu xác nhận không khớp!");
        } else {
            setIsPreNewPassWordOK(true);
            setPreNewPassWordErro("");
        }
    };

    const checkNewPass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassWord(value);
        const checkText = /(?=.*[A-Za-z])/;      // ít nhất 1 chữ
        const checkNumber = /(?=.*\d)/;          // ít nhất 1 số
        const checkLength = /^[A-Za-z\d]{8,12}$/; // đúng độ dài 8-12, chỉ chứa chữ/số
        let err = "Mật khẩu phải ";
        let hasError = false;

        if (!checkLength.test(value)) {
            err += "từ 8-12 ký tự, ";
            hasError = true;
        }
        if (!checkText.test(value)) {
            err += "ít nhất 1 chữ, ";
            hasError = true;
        }
        if (!checkNumber.test(value)) {
            err += "ít nhất 1 số, ";
            hasError = true;
        }

        if (hasError) {
            // Xoá dấu phẩy cuối nếu có
            err = err.replace(/, $/, ".");
            setNewPassWordErro(err);
            setIsNewPassWordOK(false);
        } else {
            setNewPassWordErro("");
            setIsNewPassWordOK(true);
            if (!checkIsSamePassWord(value, preNewPassWord)) {
                setPreNewPassWordErro("Mật khẩu xác nhận không khớp")
                setIsPreNewPassWordOK(false);
            }
            ;
        }
    };

    const checkIsSamePassWord = (password: String, prePassword: String) => {
        if (password === prePassword) return true;
        return false;
    }
    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    }
    const isChangePassWord = () => {
        if (isNewPassWordOK && isPreNewPassWordOK) return true;
        return false;
    }
    const changePassWord = async () => {
        if (isChangePassWord()) {
            try {
                // setIsLoading(true);
                const res = await axios.post(API_ENDPOINTS.CHANGEPASSWORD, {
                    newPassWord,
                    userId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                );
                console.log(res.data);
                setErroChangePassWord("Thay đổi mật khẩu thành công")
                setStatusChangePassWord(1);
                setHiddenChangePass(true);
                setIsHiddenNoticeChangePassWord(false);
            } catch (err: any) {
                console.log(err.response.data);
                setErroChangePassWord(" Thay đổi mật khẩu thất bại");
                setStatusChangePassWord(0);
                setIsHiddenNoticeChangePassWord(false);
            } finally {
                // setIsLoading(false);
            }
        }
    }

    return (
        <>
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
                        paddingTop: "5px",

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
                        {user?.id}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        color: "#37BD74",

                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 400,
                            width: "27%",

                        }}
                    >
                        Họ và tên
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 400,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        {user?.lastName} {user?.name}
                    </Typography>
                </Box>


                <Button variant="contained"
                    onClick={() => logout()}
                    sx={{
                        m: 1,
                        p: 0,
                        backgroundColor: "#FFC107",
                        textTransform: 'none',
                        fontFamily: "sans-serif",
                        color: "#272424",
                        fontWeight: 500,
                        fontSize: "18px",

                    }}
                >
                    <TbLogout
                        style={{
                            marginRight: "5px"
                        }}

                    /> Đăng xuất
                </Button>
                <Box component={"a"}
                    onClick={() => setHiddenChangePass(false)}
                    sx={{
                        fontFamily: "sans-serif",
                        fontSize: "18px",
                        fontStyle: "italic",
                        fontWeight: 500,
                        paddingLeft: "5px",
                        ml: "auto",
                        mt: "5px",
                        paddingRight: "5px",
                        color: "#272424",
                        ":hover": {
                            cursor: "pointer",

                        }
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
                    {menuItems.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => selectItem(item.id)}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                color: selectedItem === item.id ? "gray" : "#37BD74",
                                backgroundColor: selectedItem === item.id ? "ButtonShadow" : "none",
                                boxShadow: selectedItem === item.id ? "inset 4px 0 0 0 #2e7d32" : "none",
                                paddingTop: "5px",
                                alignItems: "center",
                                borderBottom: "1px solid grey",
                                cursor: "pointer",
                                ":hover": {
                                    backgroundColor: "ButtonHighlight",
                                    transition: "background-color 0.3s ease",
                                    color: "gray"
                                },

                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    marginLeft: "10px",


                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>

                    ))}
                </Box>
            </Box>
            {
                !hiddenChangePass && (
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
                                    width: "550px",
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
                                    }}
                                >
                                    <Button
                                        onClick={() => setHiddenChangePass(true)}
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<FontAwesomeIcon icon={faXmark} />}
                                    >
                                        Đóng
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
                                    <FontAwesomeIcon icon={faLock} color="orange" style={{ fontSize: '30px', verticalAlign: 'middle' }} />
                                    <Typography sx={{ fontSize: "25px", fontFamily: "sans-serif", fontWeight: "bold", alignContent: "center" }}>

                                        Đổi mật khẩu
                                    </Typography>
                                </Box>

                                {/* Form nhập mật khẩu */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        Nhập mật khẩu mới
                                    </Typography>
                                    <FormControl
                                        error
                                        sx={{
                                            width: "350px",
                                        }}
                                    >
                                        <Input
                                            value={newPassWord}
                                            onChange={checkNewPass}

                                        ></Input>
                                        <FormHelperText>{newPassWordErro}</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        margin: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",

                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        Nhập lại mật khẩu mới
                                    </Typography>
                                    <FormControl
                                        error
                                        sx={{
                                            width: "350px",
                                        }}
                                    >
                                        <Input
                                            value={preNewPassWord}
                                            onChange={checkPreNewPassword}

                                        ></Input>
                                        <FormHelperText>{preNewPassWordErro}</FormHelperText>
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
                                        onClick={changePassWord} // hoặc hàm xử lý đổi mật khẩu
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            fontFamily: "unset"
                                        }}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )
            }
            {
                !isHiddenNoticeChangePassWord && (
                    <>
                        <Box
                            sx={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                bgcolor: 'rgba(0, 0, 0, 0.4)', // nền đen mờ 30%
                                zIndex: 900,
                            }}
                        />

                        {/* Popup chính */}
                        <Box
                            sx={{
                                position: 'fixed',
                                top: '40%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "500px",
                                bgcolor: '#e1f7d5',
                                border: '1px solid #baffc9',
                                borderRadius: 2,
                                boxShadow: 3,
                                zIndex: 1000,
                                p: 2,
                            }}
                        >
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 2,
                                backgroundColor: "white",
                                width: "100%", // chỉnh rộng 100% của popup
                                p: 1,
                            }}>
                                <FontAwesomeIcon icon={statusChangePassWord == 1 ? faCircleCheck : faCircleExclamation} color="orange" style={{ fontSize: '30px' }} />
                                <Typography sx={{ fontSize: "20px", fontFamily: "sans-serif" }}>
                                    {erroChangePassWord}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    onClick={() => setIsHiddenNoticeChangePassWord(true)}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<FontAwesomeIcon icon={faXmark} />}
                                >
                                    Đóng
                                </Button>
                            </Box>
                        </Box>
                    </>
                )
            }

        </>

    )
}
export default InformationAdmin;