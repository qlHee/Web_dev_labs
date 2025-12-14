package com.example.quiz.dao;

import com.example.quiz.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT id, userName, userPassword as password, isDelete, userRole, createTime, updateTime FROM user WHERE userName = #{username}")
    User findByUsername(String username);

    @Select("SELECT id, userName, userPassword as password, isDelete, userRole, createTime, updateTime FROM user WHERE id = #{id}")
    User findById(Long id);

    @Select({
            "<script>",
            "SELECT id, userName, userPassword as password, isDelete, userRole, createTime, updateTime FROM user",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "userName LIKE CONCAT('%', #{keyword}, '%')",
            "</if>",
            "</where>",
            "ORDER BY id DESC",
            "<if test='pageSize != null'>",
            "LIMIT #{pageSize}",
            "<if test='offset != null'>",
            "OFFSET #{offset}",
            "</if>",
            "</if>",
            "</script>"
    })
    List<User> list(@Param("keyword") String keyword, @Param("offset") Integer offset, @Param("pageSize") Integer pageSize);

    @Select({
            "<script>",
            "SELECT COUNT(*) FROM user",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "userName LIKE CONCAT('%', #{keyword}, '%')",
            "</if>",
            "</where>",
            "</script>"
    })
    int count(@Param("keyword") String keyword);

    @Insert("INSERT INTO user (userName, userPassword, userRole) VALUES (#{userName}, #{password}, #{userRole})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);

    @Update("UPDATE user SET userPassword = #{password} WHERE id = #{id}")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Update({
            "<script>",
            "UPDATE user",
            "<set>",
            "<if test='userName != null'>userName = #{userName},</if>",
            "<if test='password != null'>userPassword = #{password},</if>",
            "<if test='userRole != null'>userRole = #{userRole},</if>",
            "</set>",
            "WHERE id = #{id}",
            "</script>"
    })
    int update(User user);
}
