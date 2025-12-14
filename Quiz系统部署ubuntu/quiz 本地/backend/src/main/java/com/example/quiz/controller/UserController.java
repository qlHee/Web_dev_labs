package com.example.quiz.controller;

import com.example.quiz.entity.Result;
import com.example.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @GetMapping("/list")
    public Result list(@RequestParam(required = false) String keyword,
                      @RequestParam(required = false, defaultValue = "1") Integer page,
                      @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        Map<String, Object> result = userService.getUserList(keyword, page, pageSize);
        return Result.success(result);
    }
    
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
    
    @PostMapping("/resetPassword")
    public Result resetPassword(@RequestBody Map<String, Long> params) {
        Long id = params.get("id");
        if (id == null) {
            return Result.error("用户ID不能为空");
        }
        return userService.resetPassword(id);
    }
}
