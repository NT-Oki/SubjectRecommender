import { Box, Typography } from "@mui/material"
const Footer = () => {
    return (
        <Box
        

            sx={{
                color:"white",
                width: "100vw",
                height: "50px",
                backgroundColor: "#3EBE30",
                position: "fixed",
                bottom: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection:"column"
            }}
        >
            <Typography

                sx={{
                    fontFamily: "sans-serif",
                    fontSize: "18px",
                    fontWeight:"bold"
                }}
            >Hệ Thống Gợi Ý Môn Học </Typography>
             <Typography

                sx={{
                    fontFamily: "Roboto",
                    fontSize: "12.8px"
                }}
            >Khoa Công nghệ thông tin </Typography>

        </Box>

    )
}
export default Footer