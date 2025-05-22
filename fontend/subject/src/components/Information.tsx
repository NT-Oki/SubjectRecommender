import { Box, Button, Typography } from "@mui/material"
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faCircleExclamation, faXmark} from '@fortawesome/free-solid-svg-icons'

import API_ENDPOINTS from "../config/apiConfig";
import axios from 'axios';
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Information = () => {
    interface User {
        id: string;
        lastName: string;
        name: string;
        major: string;
        enrollmesntYear: number;
    }
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [hasToken,setHasToken] = useState<boolean>(true);
    useEffect(() => {
        const fetchUserScore = async () => {
            const token = sessionStorage.getItem("token");
            const userId = sessionStorage.getItem("userId");
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
                setHasToken(true);
            } catch (error: any) {
                
                console.error("Lỗi khi lấy thông tin user:", error);
                  if (error.response?.status === 401 || error.response?.status === 403) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userId");
                setHasToken(false);
                // navigate("/");
            }
            }
        };

        fetchUserScore();
    }, []);
    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    }

    return (
      
        <>
        {!hasToken && (
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
  {/* Hàng chứa icon và nội dung */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 ,
    backgroundColor:"white",
    width:"500px",
    
  }}>
    <FontAwesomeIcon icon={faCircleExclamation} color="orange" style={{ fontSize: '30px' }} />
    <Typography 
    sx={{
        fontSize:"20px",
        fontFamily:"sans-serif"
    }}
    >
      Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.
    </Typography>
  </Box>

  {/* Hàng chứa button nằm dưới bên phải */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      mt: 2, // margin top
    }}
  >
    <Button
      onClick={logout}
      variant="outlined"
      color="error"
      startIcon={<FontAwesomeIcon icon={faXmark} />}
    >
      Đóng
    </Button>
  </Box>
</Box>

        )}
     
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
                        {user?.id}
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
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontWeight: 500,
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
         </>
    )


}
export default Information;