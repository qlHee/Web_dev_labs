import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // 模拟登录验证
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('admin_token', 'mock_token_123');
        localStorage.setItem('admin_username', values.username);
        message.success('登录成功');
        navigate('/');
      } else {
        message.error('用户名或密码错误');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h2 style={styles.title}>Quiz 管理系统</h2>
        <Form name="login" onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  card: { width: 400 },
  title: { textAlign: 'center', marginBottom: 24, fontWeight: 500 },
};

export default Login;
