import { Box, Button, Typography } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { MdSettingsSuggest } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
const Body2 = () => {
    return (
        // body--------------------------------------
        <Box
            sx={{
              
                display: "flex",
                width: "100vw",
                height: "500px",
                position: "fixed",
                top: "140px",
                flexDirection: "row"
            }}
        >
            {/* left----------------------------- */}
            <Box
                sx={{
                    width: "84%",
                    height: "500px",
                    backgroundColor: "yellow",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#3EBE30",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "30px",
                        height: "24px"
                    }}
                >
                    <MdSettingsSuggest />
                    <Typography
                        sx={{

                            fontFamily: "Quicksand",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "white"
                        }}
                    >
                        GỢI Ý MÔN HỌC
                    </Typography>
                </Box>
                {/* end left------------------------------------------ */}

            </Box>
            {/* right------------------------------------- */}
            <Box
                sx={{
                    backgroundColor: "olive",
                    height: "150px",
                    width: "15%",
                    marginLeft: "15px",
                    boxShadow:"0px 10px 10px 0px rgba(0, 0, 0, 0.25)"
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#3EBE30",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "20px",
                        height: "24px"
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
                            21130542
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
                                fontFamily: "Roboto",
                                fontSize: "16px",
                                fontWeight: 500,
                                paddingLeft: "5px"


                            }}>
                            Võ Thị Ngọc Thảo
                        </Typography>
                    </Box>
                  
                        
                        <Button variant="contained"
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
                            marginRight:"5px"
                           }}
                           
                           /> Đăng xuất
                        </Button>
                        <Box component={"a"}
                        href="#"
                        sx={{
                            fontFamily: "sans-serif",
                            fontSize: "16px",
                            fontStyle:"italic",
                            fontWeight: 500,
                            paddingLeft: "5px",
                            ml:"auto",
                            paddingRight:"5px",
                            color:"#272424"
                        }}
                        >
                            Đổi mật khẩu
                        </Box>
                


                </Box>
            </Box>
            {/* endright----------------------- */}


        </Box>
        //    end Body---------------------------------
    )
}
export default Body2