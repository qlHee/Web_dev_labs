package com.example.quiz.service;

import com.example.quiz.entity.Question;
import com.example.quiz.entity.Result;

import java.util.List;
import java.util.Map;

public interface QuestionService {
    
    /**
     * 添加题目
     */
    Result addQuestion(Question question);
    
    /**
     * 更新题目
     */
    Result updateQuestion(Question question);
    
    /**
     * 删除题目
     */
    Result deleteQuestion(Long id);
    
    /**
     * 获取题目详情
     */
    Result getQuestionDetail(Long id);
    
    /**
     * 分页查询题目列表
     */
    Map<String, Object> getQuestionList(String keyword, Integer page, Integer pageSize);
    
    /**
     * 获取随机题目(用于测试)
     */
    List<Question> getQuestions();
}
