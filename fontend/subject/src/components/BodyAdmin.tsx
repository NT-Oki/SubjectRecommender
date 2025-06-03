import { Box} from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import InformationAdmin from "./InformationAdmin"
import { Route, Routes } from "react-router-dom"
import ScoreAdmin from "./ScoreAdmin"
import SubjectAdmin from "./SubjectAdmin"
import StudentAdmin from "./StudentAdmin"
const BodyAdmin = () => {
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
        <Route path="score" element={<ScoreAdmin />} />
        <Route path="subject" element={<SubjectAdmin />} />
        <Route path="student" element={<StudentAdmin/>} />
        
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
            <InformationAdmin />
            </Box>
            {/* endright----------------------- */}
        </Box>
        //    end Body---------------------------------
    )
}
export default BodyAdmin;