import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from "jwt-decode";

type JwtPayload = {
  exp: number; // thời gian hết hạn (Unix timestamp - giây)
};

const TokenExpiredPopup = ({ onLogout }: { onLogout: () => void }) => (
  <>
    {/* Background mờ phủ toàn màn hình */}
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.4)', // nền đen mờ 30%
        zIndex: 900,
      }}
    />

    {/* Popup chính */}
    <Box
      sx={{
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "500px",
        bgcolor: '#e1f7d5',
        border: '1px solid #baffc9',
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
        p: 2,
      }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        backgroundColor: "white",
        width: "100%", // chỉnh rộng 100% của popup
        p: 1,
      }}>
        <FontAwesomeIcon icon={faCircleExclamation} color="orange" style={{ fontSize: '30px' }} />
        <Typography sx={{ fontSize: "20px", fontFamily: "sans-serif" }}>
          Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          color="error"
          startIcon={<FontAwesomeIcon icon={faXmark} />}
        >
          OK
        </Button>
      </Box>
    </Box>
  </>
);

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000; // Giây
    return decoded.exp < now;
  } catch {
    // Token không hợp lệ hoặc không thể decode => xem như hết hạn
    return true;
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState<boolean>(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    return !isTokenExpired(token);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        setTokenValid(false);
      } else {
        setTokenValid(true);
      }
    }, 1000); // Kiểm tra mỗi giây

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  if (!tokenValid) {
    return (
      <>
        <TokenExpiredPopup onLogout={logout} />
        <>{children}</>
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
