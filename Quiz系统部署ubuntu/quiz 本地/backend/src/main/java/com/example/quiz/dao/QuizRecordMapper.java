package com.example.quiz.dao;

import com.example.quiz.entity.QuizRecord;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizRecordMapper {

    @Insert("INSERT INTO quiz_record (userId, userName, score, totalQuestions, correctCount, createTime) VALUES (#{userId}, #{userName}, #{score}, #{totalQuestions}, #{correctCount}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(QuizRecord record);

    @Select({
            "<script>",
            "SELECT * FROM quiz_record",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "userName LIKE CONCAT('%', #{keyword}, '%')",
            "</if>",
            "</where>",
            "ORDER BY createTime DESC",
            "LIMIT #{pageSize} OFFSET #{offset}",
            "</script>"
    })
    List<QuizRecord> list(@Param("keyword") String keyword, @Param("offset") Integer offset, @Param("pageSize") Integer pageSize);

    @Select({
            "<script>",
            "SELECT COUNT(*) FROM quiz_record",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "userName LIKE CONCAT('%', #{keyword}, '%')",
            "</if>",
            "</where>",
            "</script>"
    })
    int count(@Param("keyword") String keyword);
}
