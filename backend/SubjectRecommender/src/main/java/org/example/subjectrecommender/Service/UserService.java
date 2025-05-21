package org.example.subjectrecommender.Service;

import jakarta.persistence.EntityNotFoundException;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.UserRepository;
import org.example.subjectrecommender.dto.UserDTO;
import org.example.subjectrecommender.util.PasswordUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
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

}
