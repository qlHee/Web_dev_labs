import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Select, message, Space, Popconfirm } from 'antd';
import { mockUsers } from '../data/mockData';

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...mockUsers]);
      setFilteredUsers([...mockUsers]);
      setPagination(prev => ({ ...prev, total: mockUsers.length }));
      setLoading(false);
    }, 300);
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(u => u.userName.toLowerCase().includes(keyword.toLowerCase()));
    setFilteredUsers(filtered);
    setPagination(prev => ({ ...prev, current: 1, total: filtered.length }));
  };

  const handleAddUser = (values) => {
    if (values.password !== values.checkpassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    const today = new Date();
    const createDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      userName: values.username,
      password: values.password,
      userRole: parseInt(values.userrole),
      createDate,
    };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    setFilteredUsers(newUsers);
    setPagination(prev => ({ ...prev, total: newUsers.length }));
    setAddModalVisible(false);
    addForm.resetFields();
    message.success('添加用户成功');
  };

  const handleEditUser = (values) => {
    const newUsers = users.map(u => u.id === editingUser.id ? { ...u, userName: values.userName } : u);
    setUsers(newUsers);
    setFilteredUsers(newUsers.filter(u => u.userName.toLowerCase().includes(keyword.toLowerCase())));
    setEditModalVisible(false);
    message.success('用户更新成功');
  };

  const handleDelete = (id) => {
    const newUsers = users.filter(u => u.id !== id);
    setUsers(newUsers);
    setFilteredUsers(newUsers.filter(u => u.userName.toLowerCase().includes(keyword.toLowerCase())));
    setPagination(prev => ({ ...prev, total: newUsers.length }));
    message.success('删除用户成功');
  };

  const handleResetPassword = (record) => {
    message.success('密码重置成功，新密码为: 123456');
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    editForm.setFieldsValue({ userName: record.userName });
    setEditModalVisible(true);
  };

  const columns = [
    { title: '日期', dataIndex: 'createDate', width: 120 },
    { title: '用户名', dataIndex: 'userName' },
    { title: '密码', dataIndex: 'password' },
    {
      title: '操作',
      width: 320,
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" onClick={() => openEditModal(record)}>编辑</Button>
          <Button size="small" onClick={() => handleResetPassword(record)}>重置密码</Button>
          <Popconfirm title="确定要删除该用户吗?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>删除用户</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>用户管理</h2>
      <Space style={{ marginBottom: 20 }}>
        <Input placeholder="请输入用户名关键词" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 200 }} />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button type="primary" className="add-btn" onClick={() => { addForm.resetFields(); setAddModalVisible(true); }}>添加用户</Button>
      </Space>
      <Table columns={columns} dataSource={filteredUsers} rowKey="id" loading={loading}
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: t => `共 ${t} 条`,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }) }} />

      <Modal title="添加用户" open={addModalVisible} onCancel={() => setAddModalVisible(false)} footer={null} destroyOnClose>
        <Form form={addForm} onFinish={handleAddUser} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }, { min: 3, max: 20, message: '长度在3到20个字符' }]}><Input /></Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }, { min: 6, max: 20, message: '长度在6到20个字符' }]}><Input.Password /></Form.Item>
          <Form.Item label="确认密码" name="checkpassword" rules={[{ required: true, message: '请确认密码' }]}><Input.Password /></Form.Item>
          <Form.Item label="用户类型" name="userrole" rules={[{ required: true, message: '请选择用户类型' }]} initialValue="0">
            <Select options={[{ value: '0', label: '普通用户' }, { value: '1', label: '管理员' }]} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}><Space><Button onClick={() => setAddModalVisible(false)}>取消</Button><Button type="primary" htmlType="submit">确定</Button></Space></Form.Item>
        </Form>
      </Modal>

      <Modal title="编辑用户" open={editModalVisible} onCancel={() => setEditModalVisible(false)} footer={null} destroyOnClose>
        <Form form={editForm} onFinish={handleEditUser} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="用户名" name="userName" rules={[{ required: true, message: '请输入用户名' }, { min: 3, max: 20, message: '长度在3到20个字符' }]}><Input /></Form.Item>
          <Form.Item label="密码" name="password"><Input.Password placeholder="留空则不修改密码" /></Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}><Space><Button onClick={() => setEditModalVisible(false)}>取消</Button><Button type="primary" htmlType="submit">保存</Button></Space></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
