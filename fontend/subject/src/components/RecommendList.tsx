import { Box, Typography, CircularProgress, Button, Pagination, Tooltip } from "@mui/material";
import "@fontsource/quicksand/latin.css";
import "@fontsource/roboto-serif/latin.css";
import "@fontsource/roboto/latin.css";
import "@fontsource/noto-sans/latin.css";
import { GiTwirlyFlower } from "react-icons/gi";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faCircleCheck, faStarOfLife } from "@fortawesome/free-solid-svg-icons";

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
    utility: number | null;
    preSubjects: Subject[];
    support: number | null;
    confidence: number | null;
    semester: number;
    year: number;
  }
  interface SubjectGroupRequirmentDTO {
    subjectGroup: SubjectGroup;
    requirementCredit: number;
    learnedCredit: number;
  }
  interface GroupedSubjects {
    [key: string]: SubjectRecommend[]; // Key là "Học kỳ X - Năm học Y", value là mảng SubjectRecommend
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GroupedSubjects | null>(null);
  const [dataGroup, setDataGroup] = useState<SubjectGroupRequirmentDTO[]>([]);
  const { semester } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 1;//key chứ không phải số lượng dòng
  const [total, setTotal] = useState(0);
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");
  const [totalItem, setTotalItem] = useState(0);

  useEffect(() => {
    const fetchRecommendList = async () => {



      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.RECOMMEND, {
          params: {
            userId: userId || "",
            semester: `${semester}`,
            page: page - 1,
            size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data.subjectList);
        setDataGroup(response.data.learnedSubjects);
        setTotal(response.data.total);
        setTotalItem(response.data.totalItem);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách gợi ý:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendList();
  }, [semester, page, pageSize]);
  const getScoreList = () => {
    navigate("/home/listscore")
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
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
          margin: "5px"
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
            fontFamily: "revert-layer"
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
        <Typography flex={0.3} >STT</Typography>
        <Typography flex={1.1}>Học Kỳ</Typography>
        <Typography flex={0.8}>Mã MH</Typography>
        <Typography flex={2}>Tên môn học</Typography>
        <Typography flex={0.5} sx={{ fontFamily: "sans-serif" }}>Số tín chỉ</Typography>
        <Typography flex={0.4} sx={{ fontFamily: "sans-serif" }}>Nhóm</Typography>
        <Typography flex={0.6}>Độ tin cậy</Typography>
        <Typography flex={0.6} sx={{ fontFamily: "sans-serif" }}>Độ hỗ trợ (%)</Typography>
        <Typography flex={0.8} sx={{ fontFamily: "sans-serif" }}>Chỉ số ưu tiên</Typography>
      </Box>

      {/* Loading spinner */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : data ? (Object.entries(data).map(([key, list]) => (
        <Fragment key={key}>
          {/* <Box
                                    sx={{
                                        backgroundColor: "#FFD968",
                                        display: "flex",
                                        alignItems: "center",
                                        paddingLeft: "30px",
                                        height: "30px"
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {key}
                                    </Typography>
        
        
                                </Box> */}
          {list.map((subject: SubjectRecommend, index: any) => (
            <Box
              key={subject?.subject.id || index}
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
              <Typography flex={0.3} >{index + 1}</Typography>
              <Typography flex={1.1}>{key}</Typography>
              <Tooltip
                title={
                  <Box 
                  sx={{
                    fontFamily:"sans-serif"
                  }}>
                    <div><strong> {subject.subject.subjectName}</strong></div>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Typography flex={0.8}>{subject.subject.id}</Typography>
              </Tooltip>
                 <Tooltip
                title={
                  <Box 
                  sx={{
                    fontFamily:"sans-serif"
                  }}>
                                        <div><strong>Mã môn học: </strong> {subject.subject.id}</div>
                                                            <div><strong>Môn tiên quyết:</strong> {subject.preSubjects.length>0?subject.preSubjects.map((s:Subject)=>s.id).join(", "):"không có"}</div>


                    <div><strong> {subject.subject.subjectName}</strong></div>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Typography flex={2}>{subject.subject.subjectName}</Typography>
              </Tooltip>
              <Typography flex={0.5} sx={{ fontFamily: "sans-serif" }}>{subject.subject.credit}</Typography>
              <Typography flex={0.4} sx={{ fontFamily: "sans-serif" }}>{subject.subject.subjectGroup.id == "BB" ?
                <FontAwesomeIcon icon={faStarOfLife} color="orange" title="Môn bắt buộc" />
                : subject.subject.subjectGroup.id
              }</Typography>
              <Typography flex={0.6}>{subject.confidence}</Typography>
              <Typography flex={0.6} sx={{ fontFamily: "sans-serif" }}>{subject.support}</Typography>
              <Typography flex={0.8} sx={{ fontFamily: "sans-serif" }}>{subject.utility}</Typography>

            </Box>
          ))}
        </Fragment>)
      )) : (
        // Khi không có dữ liệu
        <Typography mt={2} sx={{ paddingLeft: "30px" }}>
          Không có gợi ý nào.
        </Typography>
      )
      }


      <Box

        sx={{
          backgroundColor: "indianred",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
          height: "24px",
          marginTop: "auto",
          justifyContent: "space-around"
        }}
      >
        {/* <FontAwesomeIcon  color="white" /> */}
        <Typography
          sx={{
            paddingLeft: "5px",
            fontFamily: "sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            color: "white"
          }}
        >
          Đã học
        </Typography>
        {dataGroup.map((group: SubjectGroupRequirmentDTO, index) => (
          <Typography
            key={index}
            sx={{
              paddingLeft: "5px",
              fontFamily: "sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "white"
            }}
          >
            Nhóm {group.subjectGroup.id}: {group.learnedCredit}/{group.requirementCredit}
          </Typography>
        ))}

      </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page} color="primary"
          onChange={(_, value) => setPage(value)}
        />
        <Typography mt={1} variant="body2" align="right" sx={{ fontFamily: "sans-serif" }}>
          Tổng số: {totalItem} | Trang {page}/{Math.ceil(total / pageSize)}
        </Typography>
      </Box>


    </Box>
  );
};

export default RecommendList;
