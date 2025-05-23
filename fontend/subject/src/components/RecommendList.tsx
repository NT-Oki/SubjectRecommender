import { Box, Typography, CircularProgress, Button } from "@mui/material";
import "@fontsource/quicksand/latin.css";
import "@fontsource/roboto-serif/latin.css";
import "@fontsource/roboto/latin.css";
import "@fontsource/noto-sans/latin.css";
import { GiTwirlyFlower } from "react-icons/gi";
import axios from "axios";
import { useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { useNavigate, useParams } from "react-router-dom";

const RecommendList = () => {
  interface SubjectGroup {
    id: string;
    groupName: string;
  }
  interface Subject {
    id: string;
    subjectName: string;
    credit: number;
    subjectGroup: SubjectGroup;
  }
  interface SubjectRecommend {
    subject: Subject;
    utility: number;
  }
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SubjectRecommend[]>([]);
     const { semester } = useParams();

  useEffect(() => {
    const fetchRecommendList = async () => {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");
        
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.RECOMMEND, {
          params: {
            userId: userId || "",
            semester: `${semester}`,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách gợi ý:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendList();
  }, [semester]);
  const getScoreList=()=>{
    navigate("/home/listscore")
  }
  return (
   <>
      {/* Header chương trình đào tạo */}
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
            fontFamily: "revert-layer",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            paddingLeft: "5px",
          }}
        >
          GỢI Ý MÔN HỌC
        </Typography>
      </Box>

    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end", // ✅ Đẩy nút về bên phải
    paddingRight: "30px",        // ✅ Padding bên phải (nếu muốn)
    height: "30px",
    width: "100%", 
    margin:"5px"   
  }}
>
  <Button
    variant="contained"
    onClick={getScoreList}
    size="small"
    sx={{
      backgroundColor: "Highlight",
      color: "white",
      textTransform: "none",
      '&:hover': {
        backgroundColor: "#e69500"
      },
      fontFamily:"revert-layer"
    }}
  >
    Xem điểm
  </Button>
</Box>



      {/* Header bảng */}
      <Box
        sx={{
          backgroundColor: "#FFA500",
          display: "flex",
          alignItems: "center",
          paddingLeft: "30px",
          height: "35px",
          position: "sticky",
          top: 39,
          zIndex: 10,
          "& > *:not(:last-child)": {
            borderRight: "1px solid white",
          },
          "& > *": {
            margin: "auto",
            fontFamily: "sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Typography flex={0.2}>STT</Typography>
        <Typography flex={1}>Mã MH</Typography>
        <Typography flex={2}>Tên môn học</Typography>
        <Typography flex={0.5}>Số tín chỉ</Typography>
        <Typography flex={1.2}>Môn tiên quyết</Typography>
        <Typography flex={0.8}>Môn bắt buộc</Typography>
        <Typography flex={1}>Chỉ số ưu tiên</Typography>
      </Box>

      {/* Loading spinner */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length > 0 ? (
        // Render danh sách môn học
        data.map((item, index) => (
          <Box
            key={item.subject?.id || index}
            sx={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              paddingLeft: "30px",
              height: "27px",
              borderBottom: "1px solid #D9D9D9",
              "& > *:not(:last-child)": {
                borderRight: "1px solid #D9D9D9",
              },
              "& > *": {
                margin: "auto",
                fontFamily: "sans-serif",
                fontSize: "16px",
                color: "#272424",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            <Typography flex={0.2}>{index + 1}</Typography>
            <Typography flex={1}>{item.subject?.id}</Typography>
            <Typography flex={2}>{item.subject?.subjectName}</Typography>
            <Typography flex={0.5}>{item.subject?.credit}</Typography>
            <Typography flex={1.2}>aaaa</Typography>
            <Typography flex={0.8}>
              {item.subject.subjectGroup.id === "BB" ? "x" : ""}
            </Typography>
            <Typography flex={1}>{item.utility}</Typography>
          </Box>
        ))
      ) : (
        // Khi không có dữ liệu
        <Typography mt={2} sx={{ paddingLeft: "30px" }}>
          Không có gợi ý nào.
        </Typography>
      )}
   </>
  );
};

export default RecommendList;
