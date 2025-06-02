package org.example.subjectrecommender.Service;

import jakarta.persistence.EntityNotFoundException;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.UserRepository;
import org.example.subjectrecommender.dto.UserDTO;
import org.example.subjectrecommender.util.ConvertToUnicode;
import org.example.subjectrecommender.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
