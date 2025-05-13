package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.UserRepository;
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

}
