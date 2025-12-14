package com.example.quiz.service.impl;

import com.example.quiz.dao.AnswerMapper;
import com.example.quiz.dao.QuestionMapper;
import com.example.quiz.entity.Answer;
import com.example.quiz.entity.Question;
import com.example.quiz.entity.Result;
import com.example.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionMapper questionMapper;
    
    @Autowired
    private AnswerMapper answerMapper;

    @Override
    @Transactional
    public Result addQuestion(Question question) {
        // 参数校验
        if (question == null || question.getQuestion() == null || question.getQuestion().isEmpty()) {
            return Result.error("题目内容不能为空");
        }
        
        if (question.getAnswers() == null || question.getAnswers().isEmpty()) {
            return Result.error("至少需要一个选项");
        }
        
        // 检查是否有正确答案
        boolean hasCorrect = question.getAnswers().stream().anyMatch(Answer::isCorrect);
        if (!hasCorrect) {
            return Result.error("至少需要一个正确答案");
        }
        
        // 保存题目
        int result = questionMapper.insert(question);
        if (result <= 0) {
            return Result.error("添加题目失败");
        }
        
        // 保存选项
        for (Answer answer : question.getAnswers()) {
            answer.setQuestionId(question.getId());
            answerMapper.insert(answer);
        }
        
        return Result.success("添加题目成功");
    }

    @Override
    @Transactional
    public Result updateQuestion(Question question) {
        // 参数校验
        if (question == null || question.getId() == null) {
            return Result.error("题目ID不能为空");
        }
        
        if (question.getQuestion() == null || question.getQuestion().isEmpty()) {
            return Result.error("题目内容不能为空");
        }
        
        if (question.getAnswers() == null || question.getAnswers().isEmpty()) {
            return Result.error("至少需要一个选项");
        }
        
        // 检查是否有正确答案
        boolean hasCorrect = question.getAnswers().stream().anyMatch(Answer::isCorrect);
        if (!hasCorrect) {
            return Result.error("至少需要一个正确答案");
        }
        
        // 检查题目是否存在
        Question existQuestion = questionMapper.findById(question.getId());
        if (existQuestion == null) {
            return Result.error("题目不存在");
        }
        
        // 更新题目
        int result = questionMapper.update(question);
        if (result <= 0) {
            return Result.error("更新题目失败");
        }
        
        // 删除旧选项
        answerMapper.deleteByQuestionId(question.getId());
        
        // 保存新选项
        for (Answer answer : question.getAnswers()) {
            answer.setQuestionId(question.getId());
            answerMapper.insert(answer);
        }
        
        return Result.success("更新题目成功");
    }

    @Override
    @Transactional
    public Result deleteQuestion(Long id) {
        // 参数校验
        if (id == null) {
            return Result.error("题目ID不能为空");
        }
        
        // 检查题目是否存在
        Question existQuestion = questionMapper.findById(id);
        if (existQuestion == null) {
            return Result.error("题目不存在");
        }
        
        // 删除选项
        answerMapper.deleteByQuestionId(id);
        
        // 删除题目
        int result = questionMapper.deleteById(id);
        if (result <= 0) {
            return Result.error("删除题目失败");
        }
        
        return Result.success("删除题目成功");
    }

    @Override
    public Result getQuestionDetail(Long id) {
        // 参数校验
        if (id == null) {
            return Result.error("题目ID不能为空");
        }
        
        // 查询题目
        Question question = questionMapper.findById(id);
        if (question == null) {
            return Result.error("题目不存在");
        }
        
        // 查询选项
        List<Answer> answers = answerMapper.findByQuestionId(id);
        question.setAnswers(answers);
        
        return Result.success(question);
    }

    @Override
    public Map<String, Object> getQuestionList(String keyword, Integer page, Integer pageSize) {
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
        List<Question> questions = questionMapper.list(keyword, offset, pageSize);
        
        // 查询每个题目的选项
        for (Question question : questions) {
            List<Answer> answers = answerMapper.findByQuestionId(question.getId());
            question.setAnswers(answers);
        }
        
        int total = questionMapper.count(keyword);

        // 封装结果
        result.put("list", questions);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);

        return result;
    }

    @Override
    public List<Question> getQuestions() {
        // 获取随机题目
        List<Question> questions = questionMapper.getRandomQuestions();
        
        // 查询每个题目的选项
        for (Question question : questions) {
            List<Answer> answers = answerMapper.findByQuestionId(question.getId());
            question.setAnswers(answers);
        }
        
        return questions;
    }
}
