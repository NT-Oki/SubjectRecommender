        import { Box, Typography } from "@mui/material"
        import "@fontsource/roboto-serif/latin.css"
        import "@fontsource/roboto/latin.css"
        import "@fontsource/open-sans/latin.css"
        import "@fontsource/noto-sans/latin.css"
        import "@fontsource/quicksand/latin.css";

        // import "../assets/header.css"
        const Header = () => {
            return (
                <Box 
                sx={{
                    backgroundColor:"#3EBE30",
                    width:"100vw",
                    height:"120px",
                    position:"fixed",
                    top: 0, 
                    display:"flex",
                    alignItems:"center", 
                paddingLeft:"70px"

                }}
                >
                <Box
                component={"img"}
                src="/img/logo.png"
                alt="logo"
                sx={{
                    objectFit:"contain",
                    maxHeight:"90%",
                
                
                }}
                >
                
                </Box>
                <Box
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                   justifyContent:"center",
                    width:"100%",
                    height:"100%"


                }}
                >
                    <Typography 
                   
                    color="#FFFFFF"
                    sx={{
                        fontFamily:"sans-serif",
                        fontSize:"36px",
                        fontWeight:"bold",
                        
                    }}
                    >TRƯỜNG ĐẠI HỌC NÔNG LÂM THÀNH PHỐ HỒ CHÍ MINH</Typography>

                    <Typography 
                   
                    color="#E6B429"
                    sx={{
                        fontFamily:"Roboto Serif",
                        fontSize:"48px",
                        fontWeight:"bold",
                        
                    }}
                    >NONG LAM UNIVERSITY</Typography>
                </Box>
                </Box>



            )
        }
        export default Header