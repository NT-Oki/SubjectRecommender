package org.example.subjectrecommender.Service;

import jakarta.persistence.EntityNotFoundException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.UserRepository;
import org.example.subjectrecommender.dto.ScoreAdminDto;
import org.example.subjectrecommender.dto.UserDTO;
import org.example.subjectrecommender.dto.UserUpdateDTO;
import org.example.subjectrecommender.util.ConvertToUnicode;
import org.example.subjectrecommender.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public void save(User user) {
        userRepository.save(user);
    }
    public User getByID(String id) {
        return userRepository.getReferenceById(id);
    }
    public boolean checkExists(String id) {
         return userRepository.existsById(id);
    }
    public boolean login(String id, String password) {
        if (checkExists(id)) {
            User user = getByID(id);
            return PasswordUtil.matchPassword(password, user.getPassword());
        }
        return false;
    }
    public UserDTO getUserDTO(String id) {
        return new UserDTO(userRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("không tìm thấy user "+id)));

    }

    public boolean changePassWord(String userID, String newpassword) {
        String newPass=PasswordUtil.hashPassword(newpassword);
        System.out.println(newPass);
        return userRepository.updatePasswordById(userID, newPass)>0;
    }
    public int updatePasswordByNameorLastName(String name, String lastName){
        List<User> userList=userRepository.findByNameContainingOrLastNameContaining(name,lastName);
        int updated=0;
        for(User user:userList){
            String pass= ConvertToUnicode.removeAccentAndToLower(user.getName())+user.getId();
            String newPassWord=PasswordUtil.hashPassword(pass);
            int row= userRepository.updatePasswordById(user.getId(), newPassWord);
            updated+=row;
        }
        return updated;
    }
    public List<User> getUserList(){
        return userRepository.findAll();
    }
    public void saveAll(List<User> userList) {
        userRepository.saveAll(userList);
    }
    public List<UserDTO> getUserDTOList() {
        List<User> userList=userRepository.findAll();
        List<UserDTO> userDTOList=new ArrayList<>();
        for(User user:userList){
            userDTOList.add(new UserDTO(user));
        }
        return userDTOList;
    }
    public Page<UserDTO> getUserDtoFilter(
            String userId, String userName, Integer year, Pageable pageable) {
        Page<User> users=userRepository.findByFilters(userId,userName,year,pageable);
        List<UserDTO> userDTOList=new ArrayList<>();
        for(User user:users){
            userDTOList.add(new UserDTO(user));
        }
        return new PageImpl<>(userDTOList,pageable,users.getTotalElements());
    }
    public ByteArrayInputStream exportUserToExcel(List<UserDTO> users) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(1).setCellValue("MSSV");
            header.createCell(2).setCellValue("Họ và tên đệm");
            header.createCell(3).setCellValue("Tên");
            header.createCell(4).setCellValue("Khoa");
            header.createCell(5).setCellValue("Khóa");
            int rowIdx = 1;
            for (UserDTO dto : users) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(rowIdx-1);
                row.createCell(1).setCellValue(dto.getId());
                row.createCell(2).setCellValue(dto.getLastName());
                row.createCell(3).setCellValue(dto.getName());
                row.createCell(4).setCellValue(dto.getMajor());
                row.createCell(5).setCellValue(dto.getEnrollmentYear());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public void updateUser(UserUpdateDTO dto) {
        User user=userRepository.getReferenceById(dto.getId());
        if(dto.getLastName()!=null){
            user.setLastName(dto.getLastName());
        }if(dto.getName()!=null) {
            user.setName(dto.getName());
        }
//        }if(dto.getMajor()!=null){
//            user.setMajor(dto.getMajor());
//        }if(dto.getEnrollmentYear()!=null){
//            user.setEnrollmentYear(dto.getEnrollmentYear());
//        }
        userRepository.save(user);
    }
}
