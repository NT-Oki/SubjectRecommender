import { Box, Typography, CircularProgress, Button, Pagination, Dialog, DialogTitle, DialogActions, TextField } from "@mui/material"
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
    const [isMiningRule, setIsMiningRule] = useState<boolean>(false);
    const [utilityRate, setUtilityRate] = useState<number>(0.04);
    const [minConfidence, setMinConfidence] = useState<number>(0.2);
    const [totalUtility, setTotalUtility] = useState<number>(0);
    const [totalRule, setTotalRule] = useState<number>(0);
    const [totalSavedRule, setTotalSavedRule] = useState<number>(0);
    const [numberSavedRuleActive, setNumberSavedRuleActive] = useState<number>(0);
    // const [isMiningRule, setIsMiningRule] = useState<boolean>(false);
    const fetchRule = async () => {
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

       
    useEffect(() => {
         fetchRule();
    }, [page,pageSize]);
    const handleExport = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.ADMIN.RULE.EXPORT, {
               
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
    const handleMining=async()=>{
            try {
                setIsLoading(true);
                const response = await axios.post(API_ENDPOINTS.ADMIN.RULE.RUN_HURSM, {
                    utilityRate:utilityRate,
                    minConfidence:minConfidence
                },{
                    
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                console.log(response.data);
                setTotalUtility(response.data.totalUtility);
                setTotalRule(response.data.totalRule);
                setTotalSavedRule(response.data.totalSavedRule);
                console.log(totalUtility);
                console.log(totalRule);
                console.log(totalSavedRule);
                

            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            } finally {
                setIsLoading(false);
                
            }
        };

         const handleSaveRule=async()=>{
            try {
                setIsLoading(true);
                const response = await axios.post(API_ENDPOINTS.ADMIN.RULE.LISTRULEACTIVE,{},{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                console.log(response.data);
                setNumberSavedRuleActive(response.data.totalRowRuleActive);
                console.log(numberSavedRuleActive);
                

            } catch (error) {
                console.error("Lỗi khi lấy thông tin điểm user:", error);
            } finally {
                setIsLoading(false);
                fetchRule();
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
                color="error" onClick={()=>setIsMiningRule(true)}>Khai phá luật</Button>
                 <Button variant="contained"
                 sx={{fontFamily:"sans-serif",":hover":{
                    backgroundColor:"green",
                    color:"white"
                }}}
                color="primary" onClick={handleSaveRule}>Áp dụng</Button>
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
                         <Dialog open={isMiningRule} onClose={() => setIsMiningRule(false)} 
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    bgcolor: "#e1f7d5",
                                                    width: "250px"
                                                }
                                            }
                                        }}
                                    >
                                        <DialogTitle style={{ fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}>Khai phá luật</DialogTitle>
                                          <TextField label="UtilityRate" name="UtilityRate" type="number" fullWidth margin="dense" value={utilityRate}
                                           onChange={(e)=>{
                                            const preV=utilityRate;
                                            const value=Number(e.target.value);
                                            if(value<=0.2 && value>=0.04){
                                                    setUtilityRate(value);
                                            }else{
                                                setUtilityRate(preV);
                                            }
                                           }} 
                                           slotProps={{
                                            htmlInput:{
                                                min:0.04,
                                                max:0.2,
                                                step:0.01
                                            }
                                           }}
                                           
                                           />
                                             <TextField label="MinConfidence" name="MinConfidence" type="number" fullWidth margin="dense" value={minConfidence}
                                           onChange={(e)=>{
                                            const preV=utilityRate;
                                            const value=Number(e.target.value);
                                            if(value<=0.9 && value>=0.2){
                                                    setMinConfidence(value);
                                            }else{
                                                setMinConfidence(preV);
                                            }
                                           }} 
                                           slotProps={{
                                            htmlInput:{
                                                min:0.2,
                                                max:0.9,
                                                step:0.05
                                            }
                                           }}
                                           
                                           />
                                        <DialogActions
                                        sx={{
                                            display:"flex",
                                            justifyContent:"space-between"
                                        }}
                                        >
                                            {/* Nút này chỉ đóng dialog, không dừng quá trình ở backend */}
                                             <Button variant="contained" color="error" sx={{fontFamily:"sans-serif",":hover":{
                                                backgroundColor:"orange"
                                             }}} onClick={handleMining}>Bắt đầu</Button>
                                            <Button sx={{":hover":{
                                                backgroundColor:"AppWorkspace"
                                            }}} onClick={() => setIsMiningRule(false)}>Đóng</Button>
                                        </DialogActions>
                                    </Dialog>

        </>

        //    end Body---------------------------------
    )
}
export default RuleAdmin;