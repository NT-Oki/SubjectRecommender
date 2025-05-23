import { Box, Typography, Button } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower } from "react-icons/gi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faCircleExclamation, faXmark, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import ListScore from "./ListScore"
import { Routes, Route } from "react-router-dom";
import Information from "./Information"
import RecommendList from "./RecommendList"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Body = () => {
    
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
                    width: "80%",
                    height: "500px",
                    overflowY: "auto",
                    overflowX:"hidden"
                }}
            >
                    <Routes>
        <Route path="listscore" element={<ListScore />} />
        <Route path="recommend/:semester" element={<RecommendList />} />
      </Routes>
            </Box>
            {/* end left------------------------------------------ */}

            {/* right------------------------------------- */}
            <Box
                sx={{
                    backgroundColor: "red",
                    // height: "150px",
                    width: "19%",
                    marginLeft: "15px",
                }}
            >
            <Information />
            </Box>
            {/* endright----------------------- */}
        </Box>
        //    end Body---------------------------------
        
    )
}
export default Body;