package com.example.quiz.controller;

import com.example.quiz.dao.QuizRecordMapper;
import com.example.quiz.entity.QuizRecord;
import com.example.quiz.entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class QuizRecordController {

    @Autowired
    private QuizRecordMapper quizRecordMapper;

    @PostMapping("/submitQuiz")
    public Result submitQuiz(@RequestBody Map<String, Object> data, HttpServletRequest request) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        String userName = (String) request.getAttribute("username");
        Integer score = (Integer) data.get("score");
        Integer totalQuestions = (Integer) data.get("totalQuestions");
        Integer correctCount = (Integer) data.get("correctCount");

        QuizRecord record = new QuizRecord();
        record.setUserId(userId);
        record.setUserName(userName);
        record.setScore(score);
        record.setTotalQuestions(totalQuestions);
        record.setCorrectCount(correctCount);
        record.setCreateTime(LocalDateTime.now());

        quizRecordMapper.insert(record);
        return Result.success("提交成功");
    }

    @GetMapping("/admin/quizRecords")
    public Result getQuizRecords(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        int offset = (page - 1) * pageSize;
        List<QuizRecord> records = quizRecordMapper.list(keyword, offset, pageSize);
        int total = quizRecordMapper.count(keyword);

        Map<String, Object> result = new HashMap<>();
        result.put("list", records);
        result.put("total", total);
        return Result.success(result);
    }
}
