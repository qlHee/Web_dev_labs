package com.example.quiz.config;

import com.example.quiz.entity.Result;
import com.example.quiz.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String url = request.getRequestURI();
        
        // 0. 放行OPTIONS预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }
        
        // 1. 放行不需要权限的接口
        if (url.contains("/login") || url.contains("/register")) {
            chain.doFilter(request, response);
            return;
        }
        
        try {
            // 2. 获取token并验证
            String token = request.getHeader("token");
            if (token == null || token.isEmpty()) {
                sendErrorResponse(response, "未登录，请先登录");
                return;
            }
            
            // 3. 验证token是否有效
            if (!jwtUtil.validateToken(token)) {
                sendErrorResponse(response, "登录已过期，请重新登录");
                return;
            }
            
            // 4. 获取token中的信息
            Claims claims = jwtUtil.extractClaims(token);
            request.setAttribute("userId", claims.get("id"));
            request.setAttribute("username", claims.get("username"));
            request.setAttribute("userRole", claims.get("userRole", Integer.class));
            
            // 5. 如果是管理员接口，验证角色
            if (url.contains("/admin/") && request.getAttribute("userRole") == null) {
                sendErrorResponse(response, "无权限访问");
                return;
            }
            
            // 放行
            chain.doFilter(request, response);
            
        } catch (Exception e) {
            sendErrorResponse(response, "登录验证失败");
        }
    }
    
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        Result result = Result.error(message);
        PrintWriter out = response.getWriter();
        out.write(new ObjectMapper().writeValueAsString(result));
        out.flush();
        out.close();
    }
}
