import { Box, Button, ButtonGroup, Typography, ToggleButton, ToggleButtonGroup, RadioGroup, FormControlLabel, Radio, Input, FormControl, FormHelperText } from "@mui/material"
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faCircleExclamation, faXmark, faLightbulb, faLock } from '@fortawesome/free-solid-svg-icons'

import API_ENDPOINTS from "../config/apiConfig";
import axios from 'axios';
import { useEffect, useState } from "react";
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
    const [semester, setSemester] = useState<number | null>(1);
    const [hiddenChangePass, setHiddenChangePass] = useState<boolean>(false);
     const [newPassWord, setNewPassWord] = useState("");
     const [preNewPassWord, setPreNewPassWord] = useState("");
     const [newPassWordErro, setNewPassWordErro] = useState("");
     const [preNewPassWordErro, setPreNewPassWordErro] = useState("");

    

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
                // setHasToken(true);
            } catch (error: any) {

                console.error("Lỗi khi lấy thông tin user:", error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("userId");
                    // setHasToken(false);
                    // navigate("/");
                }
            }
        };

        fetchUserScore();
    }, []);
    
    const checkPreNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setPreNewPassWord(value);

  if (newPassWord === "") {
    setPreNewPassWordErro("Vui lòng nhập mật khẩu trước");
    return; // dừng luôn nếu chưa nhập mật khẩu chính
  }

  if (value !== newPassWord) {
    setPreNewPassWordErro("Mật khẩu xác nhận không khớp!");
  } else {
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
    } else {
        setNewPassWordErro("");
    }
};

    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    }
    const recommend=()=>{
        navigate(`/home/recommend/${semester}`)
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
                                paddingTop: "5px",
                                alignItems:"center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Roboto",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    marginRight: "10px"
                                }}
                            >
                                Học kỳ:
                            </Typography>


                            <RadioGroup
                                value={semester}
                                onChange={(e) => setSemester(Number(e.target.value))}
                                row // thêm dòng này nếu bạn muốn các nút hiển thị ngang hàng
                            >
                                <FormControlLabel value="1" control={<Radio color="success" />} label="1" />
                                <FormControlLabel value="2" control={<Radio color="success" />} label="2" />
                            </RadioGroup>

                        </Box>
                            <Button variant="contained"
                        onClick={recommend}
                        sx={{
                            m: 1,
                            p: 0,
                            backgroundColor: "orangered",
                            textTransform: 'none',
                            fontFamily: "sans-serif",
                            color: "#272424",
                            fontWeight: 500,
                            fontSize: "17px",

                        }}
                    >
                        <FontAwesomeIcon icon={faLightbulb}
                        color="yellow"
                       style={
                        {
                            marginRight: "7px"
                        }
                       }
                        ></FontAwesomeIcon> Gợi ý môn học
                    </Button> 

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
              onClick={logout}
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
            <Typography sx={{ fontSize: "25px", fontFamily: "sans-serif", fontWeight: "bold" ,alignContent:"center"}}>
                
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
          sx={{
                                width:"350px",
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
          sx={{
                                width:"350px",
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
              justifyContent: 'flex-end',
              mt: 3,
            }}
          >
            <Button
              onClick={()=>{}} // hoặc hàm xử lý đổi mật khẩu
              variant="contained"
              color="primary"
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

            </>
        
    )


}
export default Information;