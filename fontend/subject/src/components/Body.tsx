import { Box, Button, Typography } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import ListScore from "./ListScore"
import Information from "./Information"
import { useNavigate } from "react-router-dom"
const Body = () => {
  const [hasToken, setHasToken] = useState(!!sessionStorage.getItem("token"));
  const navigate=useNavigate();
    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    }
    return (
      
        
 
        // body--------------------------------------
        <Box
            sx={{

                display: "flex",
                width: "100vw",
                height: "500px",
                position: "fixed",
                top: "128px",
                flexDirection: "row"
            }}
        >
            {/* left----------------------------- */}
            <Box
                sx={{
                    width: "84%",
                    height: "500px",
                    overflowY: "auto",

                }}
            >
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
                        CHƯƠNG TRÌNH ĐÀO TẠO
                    </Typography>
                </Box>
                <Box
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
                            fontFamily: "revert-layer",
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
                    <Typography flex={1}>Mã MH</Typography>
                    <Typography flex={2}>Tên môn học</Typography>
                    <Typography flex={0.5}>Số tín chỉ</Typography>
                    <Typography flex={1}>Môn tiên quyết</Typography>
                    <Typography flex={0.6}>Môn bắt buộc</Typography>
                    <Typography flex={1}>Điểm</Typography>
                    <Typography flex={0.4}>Đã học</Typography>
                </Box>
                {/* ///////// */}

                <ListScore />

            </Box>
            {/* end left------------------------------------------ */}
            {/* right------------------------------------- */}

            <Information />
            {/* endright----------------------- */}


        </Box>
        //    end Body---------------------------------
             
    )
}
export default Body;