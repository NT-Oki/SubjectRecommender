import {  useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/apiConfig";
import { Box, Button, Input, Typography, InputAdornment, IconButton, FormHelperText, FormControl, CircularProgress } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import nonglam from '../assets/nonglam.jpg';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faCircleExclamation, faXmark, faLightbulb, faLock, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
const Login = () => {
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hidenForgotPassWord, setHidenForgotPassWord] = useState(true);
    const [hiddenChangePass, setHiddenChangePass] = useState<boolean>(true);
    const [newPassWord, setNewPassWord] = useState("");
    const [preNewPassWord, setPreNewPassWord] = useState("");
    const [newPassWordErro, setNewPassWordErro] = useState("");
    const [preNewPassWordErro, setPreNewPassWordErro] = useState("");
    const [userIdForgotErro, setUserIdForgotErro] = useState("");
    const [isNewPassWordOK, setIsNewPassWordOK] = useState(false);
    const [isPreNewPassWordOK, setIsPreNewPassWordOK] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHiddenNoticeChangePassWord, setIsHiddenNoticeChangePassWord] = useState(true);
    const [erroChangePassWord, setErroChangePassWord] = useState("");
    const [statusChangePassWord, setStatusChangePassWord] = useState<Number>(0);
    const [hiddenTokenForm, setHiddenTokenForm] = useState<boolean>(true);
    const [tokenForgot, setTokenForgot] = useState("");
    const [tokenErro, setTokenErro] = useState("");
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const [userIdForgot, setUserIdForgot] = useState("");
    const navigate = useNavigate();
    // Hàm gọi API login
    const handleLogin = async (userID: string, password: string) => {
        try {
            const response = await axios.post(API_ENDPOINTS.LOGIN, null, {
                params: {
                    userID,
                    password
                }
            });

            const token = response.data.token;
            const userId = response.data.userId;
            const exp = response.data.exp;
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("exp", exp);

            alert("Đăng nhập thành công!");
            // Ví dụ chuyển trang
            navigate("/home/listscore")
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
               alert(error.response?.data);
            } else {
                alert(error);
            }
        }
    };
    
    const sendUserId = async ()=>{
        try{
            setIsLoading(true);
            const res =await axios.post(API_ENDPOINTS.FORGOTPASSWORD,{
                userId: userIdForgot,
            })
            setHidenForgotPassWord(true);
            setHiddenTokenForm(false);
            console.log(res.data);
        }catch(err:any){
          setUserIdForgotErro(err.response.data)
        }finally{
            setIsLoading(false);
        }
    }
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
      const isChangePassWord = () => {
        if (isNewPassWordOK && isPreNewPassWordOK) return true;
        return false;
    }
    const changePassWord = async () => {
        if (isChangePassWord()) {
            try {
                setIsLoading(true);
                const res = await axios.post(API_ENDPOINTS.CHANGEPASSWORD, {
                    newPassWord,
                    userId: userIdForgot,
                }, 
                );
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
                setIsLoading(false);
            }
        }
    }
    const checkToken =async ()=>{
        try{
            const res= await axios.post(API_ENDPOINTS.CHECKTOKEN,{
                token:tokenForgot,
                userId: userIdForgot,
            });
            setHiddenTokenForm(true);
            setHiddenChangePass(false);
        }catch(err:any){
            setTokenErro(err.response.data)
        }
    }
    return (
        <>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position:"fixed",
                top:"52px",
            }}

        >
            <Box
                sx={{
                    marginTop: "85px",
                    marginRight: "30px",
                    width: "1100px",
                    height: "500px",
                    backgroundImage: `url(${nonglam})`, // đường dẫn tương đối hoặc tuyệt đối
                    backgroundSize: "cover", // để ảnh phủ đầy Box
                    backgroundPosition: "center", // căn giữa ảnh
                    backgroundRepeat: "no-repeat" // không lặp ảnh
                }}
            >
            </Box>
            <Box
                sx={{
                    width: "400px",
                    height: "320px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "column"

                }}
            >

                {/* Nội dung bên trong */}
                <Box
                    sx={{
                        backgroundColor: "#3EBE30",
                        width: "296px",
                        height: "60px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "15px",
                        alignItems: "center"


                    }}
                >
                    {/* tieude */}
                    <Typography
                        sx={{
                            color: "#FFC107",
                            fontFamily: "sans-serif",
                            fontSize: "32px",
                            fontWeight: "bold"
                        }}
                    >
                        ĐĂNG NHẬP
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        backgroundColor: "#D1D5DA",
                        flex: "1",
                        borderRadius: "15px",
                        justifyContent: "space-evenly",
                        // "& > *": {
                        //     margin: "10px"
                        // }


                    }}
                >
                    {/* noidung */}
                    <Typography
                        sx={{
                            fontFamily: "roboto-serif",
                            fontSize: "32px",
                            width: "85%",
                            marginLeft: "7.5%"

                        }}
                    >
                        Mã số sinh viên:
                    </Typography>
                    <Input
                        type="text"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                        sx={{
                            backgroundColor: "#FFFFFF",
                            height: "42px",
                            borderRadius: "10px",
                            width: "90%",
                            marginLeft: "5%"
                        }}
                    >
                    </Input>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "roboto-serif",
                                fontSize: "32px",
                                width: "85%",
                                marginLeft: "7.5%"

                            }}
                        >
                            Mật khẩu:
                        </Typography>
                        <Typography
                            onClick={() => setHidenForgotPassWord(false)}
                            sx={{
                                fontFamily: "roboto-serif",
                                fontSize: "24px",
                                width: "85%",
                                marginLeft: "7.5%",
                                alignSelf: "self-end",
                                fontStyle: "italic",
                                cursor: "pointer",

                            }}
                        >
                            Quên mật khẩu
                        </Typography>
                    </Box>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            backgroundColor: "#FFFFFF",
                            height: "42px",
                            borderRadius: "10px",
                            width: "90%",
                            marginLeft: "5%"
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleTogglePassword}
                                    edge="start"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Button
                        onClick={() => handleLogin(userID, password)}
                        sx={{
                            backgroundColor: "#3EBE30",
                            width: "90%",
                            marginLeft: "5%",
                            borderRadius: "10px",
                            height: "50px",
                            fontFamily: "roboto-serif",
                            fontSize: "24px",
                            textTransform: "none",
                            color: "#FFFFFF"
                        }}
                    >
                        Đăng nhập
                    </Button>

                </Box>
            </Box >
        </Box>

         {
                        !hidenForgotPassWord && (
                            <>
                                <Box
                                    sx={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        width: '100vw',
                                        height: '100vh',
                                        bgcolor: 'rgba(0, 0, 0, 0.4)', // nền đen mờ 30%
                                        zIndex: 700,
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
                                        zIndex: 800,
                                        p: 2,
                                    }}
                                >
                                     <Box sx={{ display: 'flex', justifyContent: 'flex-end',position:"fixed",right:1}}>
                                        <Button
                                            onClick={() => setHidenForgotPassWord(true)}
                                            variant="outlined"
                                            color="error"
                                            startIcon={<FontAwesomeIcon icon={faXmark} />}
                                        >
                                            Đóng
                                        </Button>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 2,  
                                        width: "100%",
                                        justifyContent:"center",
                                        p: 1,
                                    }}>
                                        <FontAwesomeIcon icon={faLock} color="orange" style={{ fontSize: '30px' }} />
                                        <Typography sx={{ fontSize: "22px", fontFamily: "sans-serif", fontWeight:"bold" }}>
                                           Quên mật khẩu
                                        </Typography>
                                         
                                        
                                    </Box>
                                    
                                    <Box
                                        sx={{
                                            display:"flex",
                                            justifyContent:"space-between",
                                            alignItems: "center",
                                            mt:"10px"
                                          
                                        }}
                                    >
                                        <Typography
                                        sx={{
                                              fontFamily:"sans-serif",
                                  
                                        }}
                                        >Nhập mã số sinh viên: </Typography>
                                        <FormControl
                                         sx={{
                                        flexGrow:"0.8",
                                  
                                    }}
                                    error
                                        >
                                            
                                        
                                    <Input
                                    type="text"
                                    autoFocus
                                    value={userIdForgot}
                                    onChange={e=>setUserIdForgot(e.target.value)}
                                    ></Input>
                                    <FormHelperText
                                    sx={{
                                              fontFamily:"sans-serif"
                                    }}
                                    >{userIdForgotErro}</FormHelperText>
                                    </FormControl>
        </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            onClick={sendUserId}
                                            variant="contained"
                                            color="error"
                                           
                                        >
                                            Gửi
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
                     {
    isLoading ? (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'rgba(0, 0, 0, 0.4)', // nền đen mờ
                    zIndex: 900,
                }}
            />
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                }}
            >
                <CircularProgress />
            </Box>
        </>
    ) : null
}
                       {
                        !hiddenTokenForm && (
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
                                     <Box sx={{ display: 'flex', justifyContent: 'flex-end',position:"fixed",right:1}}>
                                        <Button
                                            onClick={() => setHiddenTokenForm(true)}
                                            variant="outlined"
                                            color="error"
                                            startIcon={<FontAwesomeIcon icon={faXmark} />}
                                        >
                                            Đóng
                                        </Button>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 2,  
                                        width: "100%",
                                        justifyContent:"center",
                                        p: 1,
                                    }}>
                                      
                                        <Typography sx={{ fontSize: "22px", fontFamily: "sans-serif", fontWeight:"bold" }}>
                                           Vui lòng nhập mã xác thực
                                        </Typography>
                                         
                                        
                                    </Box>
                                    
                                    <Box
                                        sx={{
                                            display:"flex",
                                            justifyContent:"space-between",
                                            alignItems: "center",
                                            mt:"10px"
                                          
                                        }}
                                    >
                                        <Typography
                                        sx={{
                                              fontFamily:"sans-serif",
                                  
                                        }}
                                        >Mã xác thực: </Typography>
                                        <FormControl
                                         sx={{
                                        flexGrow:"0.8",
                                  
                                    }}
                                    error
                                        >
                                            
                                        
                                    <Input
                                    type="text"
                                    autoFocus
                                    value={tokenForgot}
                                    onChange={e=>setTokenForgot(e.target.value)}
                                    ></Input>
                                    <FormHelperText
                                    sx={{
                                              fontFamily:"sans-serif"
                                    }}
                                    >{tokenErro}</FormHelperText>
                                    </FormControl>
        </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            onClick={checkToken}
                                            variant="contained"
                                            color="error"
                                           
                                        >
                                            Gửi
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
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
                                justifyContent:"center",
                            }}>
                                <FontAwesomeIcon icon={statusChangePassWord==1? faCircleCheck: faCircleExclamation} color="orange" style={{ fontSize: '30px' }} />
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

    );
};

export default Login;
