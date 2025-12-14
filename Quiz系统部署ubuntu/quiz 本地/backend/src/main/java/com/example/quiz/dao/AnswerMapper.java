package com.example.quiz.dao;

import com.example.quiz.entity.Answer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AnswerMapper {

    @Select("SELECT * FROM answer WHERE question_id = #{questionId}")
    List<Answer> findByQuestionId(Long questionId);

    @Insert("INSERT INTO answer (question_id, text, correct) VALUES (#{questionId}, #{text}, #{correct})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Answer answer);

    @Delete("DELETE FROM answer WHERE id = #{id}")
    int deleteById(Long id);

    @Delete("DELETE FROM answer WHERE question_id = #{questionId}")
    int deleteByQuestionId(Long questionId);

    @Update("UPDATE answer SET text = #{text}, correct = #{correct} WHERE id = #{id}")
    int update(Answer answer);
}
