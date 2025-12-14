package com.example.quiz.controller;

import com.example.quiz.entity.Question;
import com.example.quiz.entity.Result;
import com.example.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class QuestionController {

    @Autowired
    private QuestionService questionService;
    
    @GetMapping("/getQuestion")
    public Result getQuestion() {
        List<Question> questionList = questionService.getQuestions();
        return Result.success(questionList);
    }
    
    @GetMapping("/question/list")
    public Result list(@RequestParam(required = false) String keyword,
                      @RequestParam(required = false, defaultValue = "1") Integer page,
                      @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        Map<String, Object> result = questionService.getQuestionList(keyword, page, pageSize);
        return Result.success(result);
    }
    
    @GetMapping("/question/detail/{id}")
    public Result detail(@PathVariable Long id) {
        return questionService.getQuestionDetail(id);
    }
    
    @PostMapping("/question/add")
    public Result add(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }
    
    @PostMapping("/question/update")
    public Result update(@RequestBody Question question) {
        return questionService.updateQuestion(question);
    }
    
    @DeleteMapping("/question/delete/{id}")
    public Result delete(@PathVariable Long id) {
        return questionService.deleteQuestion(id);
    }
}
