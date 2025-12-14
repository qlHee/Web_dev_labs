package com.example.quiz.service;

import com.example.quiz.entity.Result;
import com.example.quiz.entity.User;

import java.util.Map;

public interface UserService {
    
    /**
     * 用户登录
     */
    User login(String username, String password);
    
    /**
     * 添加用户
     */
    Result saveUser(String username, String password, String checkpassword, String role);
    
    /**
     * 重置用户密码
     */
    Result resetPassword(Long userId);
    
    /**
     * 删除用户
     */
    Result deleteUser(Long userId);
    
    /**
     * 分页查询用户列表
     */
    Map<String, Object> getUserList(String keyword, Integer page, Integer pageSize);
}
