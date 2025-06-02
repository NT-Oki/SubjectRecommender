import { Box } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import ListScore from "./ListScore"
import { Routes, Route } from "react-router-dom";
import Information from "./Information"
import RecommendList from "./RecommendList"
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
                    overflowX: "hidden"
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
                    width: "18%",
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