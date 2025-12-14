package com.example.quiz.service.impl;

import com.example.quiz.dao.UserMapper;
import com.example.quiz.entity.Result;
import com.example.quiz.entity.User;
import com.example.quiz.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        }
        return null;
    }

    @Override
    public Result saveUser(String username, String password, String checkpassword, String role) {
        // 参数校验
        if (StringUtils.isAnyBlank(username, password, checkpassword, role)) {
            return Result.error("参数不能为空");
        }

        // 密码一致性校验
        if (!password.equals(checkpassword)) {
            return Result.error("两次输入的密码不一致");
        }

        // 用户名唯一性校验
        User existUser = userMapper.findByUsername(username);
        if (existUser != null) {
            return Result.error("用户名已存在");
        }

        // 创建用户
        User user = new User();
        user.setUserName(username);
        user.setPassword(password);
        try {
            user.setUserRole(Integer.parseInt(role));
        } catch (NumberFormatException e) {
            return Result.error("角色参数错误");
        }

        // 保存用户
        int result = userMapper.insert(user);
        if (result > 0) {
            return Result.success("用户创建成功");
        } else {
            return Result.error("用户创建失败");
        }
    }

    @Override
    public Result resetPassword(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }

        // 重置密码为123456
        String newPassword = "123456";
        int result = userMapper.updatePassword(userId, newPassword);
        if (result > 0) {
            return Result.success("密码重置成功");
        } else {
            return Result.error("密码重置失败");
        }
    }

    @Override
    public Result deleteUser(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }

        // 不允许删除管理员用户
        if (user.getUserRole() == 1) {
            return Result.error("不能删除管理员用户");
        }

        int result = userMapper.deleteById(userId);
        if (result > 0) {
            return Result.success("用户删除成功");
        } else {
            return Result.error("用户删除失败");
        }
    }

    @Override
    public Map<String, Object> getUserList(String keyword, Integer page, Integer pageSize) {
        Map<String, Object> result = new HashMap<>();

        // 计算分页参数
        if (page == null || page < 1) {
            page = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        Integer offset = (page - 1) * pageSize;

        // 查询数据
        List<User> users = userMapper.list(keyword, offset, pageSize);
        int total = userMapper.count(keyword);

        // 封装结果
        result.put("list", users);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);

        return result;
    }
}
