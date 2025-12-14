package com.example.quiz.entity;

public class Result {
    private Integer code;
    private String msg;
    private Object data;

    public Result() {
    }

    public Result(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Result(Integer code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static Result success() {
        return new Result(1, "操作成功");
    }

    public static Result success(String msg) {
        return new Result(1, msg);
    }

    public static Result success(Object data) {
        Result result = new Result(1, "操作成功");
        result.setData(data);
        return result;
    }

    public static Result error() {
        return new Result(0, "操作失败");
    }

    public static Result error(String msg) {
        return new Result(0, msg);
    }
}
