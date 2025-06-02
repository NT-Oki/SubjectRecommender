import { Box, Typography } from "@mui/material"
const Footer = () => {
    return (
        <Box
            component={"footer"}

            sx={{
                width: "100vw",
                height: "50px",
                backgroundColor: "#3EBE30",
                position: "fixed",
                bottom: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Typography

                sx={{
                    fontFamily: "Roboto",
                    fontSize: "12.8px"
                }}
            >@Coppyright: 21130542 Võ Thị Ngọc Thảo</Typography>

        </Box>

    )
}
export default Footer