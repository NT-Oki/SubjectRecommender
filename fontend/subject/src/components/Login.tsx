import { FormEvent, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/apiConfig";
import { Box, Button, Input, Typography, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import nonglam from '../assets/nonglam.jpg';
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
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
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userId", userId);

            alert("Đăng nhập thành công!");
            // Ví dụ chuyển trang
            navigate("/home")
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
               alert(error.response?.data);
            } else {
                alert(error);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleLogin(userID, password);
    };

    return (
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
                            onClick={() => console.log("Xử lý quên mật khẩu")}
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

    );
};

export default Login;
