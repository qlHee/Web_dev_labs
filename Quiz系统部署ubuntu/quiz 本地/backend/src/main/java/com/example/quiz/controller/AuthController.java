package com.example.quiz.controller;

import com.example.quiz.entity.Result;
import com.example.quiz.entity.User;
import com.example.quiz.service.UserService;
import com.example.quiz.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public Result login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        if (StringUtils.isAnyBlank(username, password)) {
            return Result.error("用户名或密码为空");
        }
        
        User userResult = userService.login(username, password);
        if (userResult != null) {
            Claims claims = Jwts.claims();
            claims.put("id", userResult.getId());
            claims.put("username", userResult.getUserName());
            claims.put("userRole", userResult.getUserRole());
            
            String token = jwtUtil.generateTokenWithClaims(claims);
            Result result = Result.success("用户登录成功");
            result.setData(token);
            return result;
        } else {
            return Result.error("用户名或密码错误");
        }
    }
    
    @PostMapping("/admin/login")
    public Result adminLogin(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        if (StringUtils.isAnyBlank(username, password)) {
            return Result.error("用户名或密码为空");
        }
        
        User userResult = userService.login(username, password);
        if (userResult != null) {
            // 检查是否是管理员
            if (userResult.getUserRole() == null || userResult.getUserRole() != 1) {
                return Result.error("您不是管理员，无权登录管理系统");
            }
            
            Claims claims = Jwts.claims();
            claims.put("id", userResult.getId());
            claims.put("username", userResult.getUserName());
            claims.put("userRole", userResult.getUserRole());
            
            String token = jwtUtil.generateTokenWithClaims(claims);
            Result result = Result.success("管理员登录成功");
            result.setData(token);
            return result;
        } else {
            return Result.error("用户名或密码错误");
        }
    }
    
    @PostMapping("/register")
    public Result register(@RequestBody Map<String, String> registerData) {
        String username = registerData.get("username");
        String password = registerData.get("password");
        String checkpassword = registerData.get("checkpassword");
        
        if (StringUtils.isAnyBlank(username, password, checkpassword)) {
            return Result.error("用户名或密码为空");
        }
        
        final String role = "0";  // 普通用户
        Result result = userService.saveUser(username, password, checkpassword, role);
        return result;
    }
    
    @PostMapping("/addUser")
    public Result addUser(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");
        String checkpassword = userData.get("checkpassword");
        String role = userData.get("userrole");
        
        if (StringUtils.isAnyBlank(username, password, checkpassword, role)) {
            return Result.error("用户名或密码为空");
        }
        
        Result result = userService.saveUser(username, password, checkpassword, role);
        return result;
    }
}
