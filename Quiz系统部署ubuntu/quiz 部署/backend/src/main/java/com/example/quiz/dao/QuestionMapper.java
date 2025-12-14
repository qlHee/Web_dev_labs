package com.example.quiz.dao;

import com.example.quiz.entity.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {

    @Select("SELECT * FROM question WHERE id = #{id}")
    Question findById(Long id);

    @Select({
            "<script>",
            "SELECT * FROM question",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "question LIKE CONCAT('%', #{keyword}, '%')",
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
    List<Question> list(@Param("keyword") String keyword, @Param("offset") Integer offset, @Param("pageSize") Integer pageSize);

    @Select({
            "<script>",
            "SELECT COUNT(*) FROM question",
            "<where>",
            "<if test='keyword != null and keyword != \"\"'>",
            "question LIKE CONCAT('%', #{keyword}, '%')",
            "</if>",
            "</where>",
            "</script>"
    })
    int count(@Param("keyword") String keyword);

    @Insert("INSERT INTO question (question) VALUES (#{question})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Question question);

    @Delete("DELETE FROM question WHERE id = #{id}")
    int deleteById(Long id);

    @Update("UPDATE question SET question = #{question} WHERE id = #{id}")
    int update(Question question);
    
    @Select("SELECT * FROM question ORDER BY RAND() LIMIT 5")
    List<Question> getRandomQuestions();
}
