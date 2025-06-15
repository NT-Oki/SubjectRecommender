import { Box, Typography, CircularProgress, Button, Pagination } from "@mui/material"
import "@fontsource/quicksand/latin.css"
import "@fontsource/roboto-serif/latin.css"
import "@fontsource/roboto/latin.css"
import "@fontsource/noto-sans/latin.css"
import { GiTwirlyFlower } from "react-icons/gi";
import axios from 'axios';
import { useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
const RuleAdmin = () => {
    interface RuleActive {
        id: number;
        antecedentItems: string;
        consequentItems: string;
        support: number;
        confidence: number;
        utility: number;
    }
    // const years = Array.from({ length: 2 }, (_, i) => 2020 + i);
    const token = sessionStorage.getItem("token");
    const [data, setData] = useState<RuleActive[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
        const [page, setPage] = useState(1);
    const pageSize = 10;
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const fetchUserScore = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(API_ENDPOINTS.ADMIN.RULE.LISTRULEACTIVE, {
                    params:{
                             page: page - 1,
                    size: pageSize,

                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setData(response.data.listRule);
                setTotal(response.data.total);

            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserScore();
    }, [page,pageSize]);
    const handleExport = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.CURRICULUM.EXPORT, {
                params: {
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', //BẮT BUỘC: để axios hiểu đây là file
            });

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'rules'  + '.xlsx'; // Tên file khi lưu
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Giải phóng URL sau khi xong
            alert("Xuất Excel thành công!");
        } catch (err: any) {
            alert(err.response?.data || "Lỗi khi xuất file");
        }
    };

    return (
        // body--------------------------------------
        <>
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
            <Box display="flex" gap={2} mb={2} mt={2} justifyContent={"center"}>
              
                <Button variant="outlined" sx={{fontFamily:"sans-serif",":hover":{
                    backgroundColor:"green",
                    color:"white"
                }}} onClick={handleExport}>Xuất Excel</Button>
                <Button variant="contained"
                 sx={{fontFamily:"sans-serif",":hover":{
                    backgroundColor:"green",
                    color:"white"
                }}}
                color="error" onClick={()=>{}}>Bắt đầu khai phá</Button>
                 <Button variant="contained"
                 sx={{fontFamily:"sans-serif",":hover":{
                    backgroundColor:"green",
                    color:"white"
                }}}
                color="primary" onClick={()=>{}}>Áp dụng</Button>
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
                        fontFamily: "sans-serif",
                        fontSize: "16px",
                        // fontWeight: "bold",
                        color: "white",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    },
                }}
            >
                <Typography sx={{fontFamily:"sans-serif"}} flex={0.2}>STT</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={3}>Tiền đề</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>Hệ quả</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>Độ hỗ trợ</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>Độ tin cậy</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>Độ hữu ích</Typography>
            </Box>
            {/* ///////// */}

            {isLoading ?
                (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : 
                <>
                        {data.map((rule: RuleActive, index: any) => (
                            <Box
                                key={rule?.id || index}
                                sx={{
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: "30px",
                                    height: "27px",
                                    borderBottom: "1px solid #D9D9D9",

                                    "& > *:not(:last-child)": {
                                        borderRight: "1px solid #D9D9D9",
                                        // để đường gạch bằng chiều cao của Box
                                    },
                                    "& > *": {
                                        margin: "auto",
                                        fontFamily: "sans-serif",
                                        fontSize: "16px",
                                        color: "#272424",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"

                                    },
                                }}
                            >
                                          <Typography sx={{fontFamily:"sans-serif"}} flex={0.2}>{index+1}</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={3}>{rule.antecedentItems}</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>{rule.consequentItems}</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>{rule.support}</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>{rule.confidence}</Typography>
                <Typography sx={{fontFamily:"sans-serif"}} flex={1}>{rule.utility}</Typography>

                            </Box>
                        ))}
                    
                </>
            }
             <Box display="flex" justifyContent="center" mt={1}>
                            <Pagination
                                count={Math.ceil(total / pageSize)}
                                page={page} color="primary"
                                onChange={(_, value) => setPage(value)}
                            />
                        </Box>
            
                        <Typography mt={3} variant="body2" align="right">
                            Tổng số: {total} | Trang {page}/{Math.ceil(total / pageSize)}
                        </Typography>

        </>

        //    end Body---------------------------------
    )
}
export default RuleAdmin;