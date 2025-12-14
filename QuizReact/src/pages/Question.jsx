import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Radio, Space, Popconfirm, message, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockQuestions } from '../data/mockData';

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [answers, setAnswers] = useState([{ text: '' }, { text: '' }, { text: '' }, { text: '' }]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuestions([...mockQuestions]);
      setFilteredQuestions([...mockQuestions]);
      setPagination(prev => ({ ...prev, total: mockQuestions.length }));
      setLoading(false);
    }, 300);
  }, []);

  const handleSearch = () => {
    const filtered = questions.filter(q => q.question.toLowerCase().includes(keyword.toLowerCase()));
    setFilteredQuestions(filtered);
    setPagination(prev => ({ ...prev, current: 1, total: filtered.length }));
  };

  const openAddModal = () => {
    setIsEdit(false);
    setEditingQuestion(null);
    setAnswers([{ text: '' }, { text: '' }, { text: '' }, { text: '' }]);
    setCorrectIndex(-1);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setIsEdit(true);
    setEditingQuestion(record);
    form.setFieldsValue({ question: record.question });
    setAnswers([...record.answers.map(a => ({ text: a.text }))]);
    setCorrectIndex(record.answers.findIndex(a => a.correct));
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (correctIndex < 0) { message.warning('请选择一个正确答案'); return; }
      const filteredAnswers = answers.filter(a => a.text.trim() !== '');
      if (filteredAnswers.length < 2) { message.warning('至少需要两个选项'); return; }
      if (!filteredAnswers[correctIndex] || !filteredAnswers[correctIndex].text.trim()) {
        message.warning('正确答案的选项内容不能为空'); return;
      }
      const finalAnswers = filteredAnswers.map((a, i) => ({ text: a.text, correct: i === correctIndex }));

      if (isEdit) {
        const newQuestions = questions.map(q => q.id === editingQuestion.id ? { ...q, question: values.question, answers: finalAnswers } : q);
        setQuestions(newQuestions);
        setFilteredQuestions(newQuestions.filter(q => q.question.toLowerCase().includes(keyword.toLowerCase())));
        message.success('修改题目成功');
      } else {
        const newQuestion = { id: Math.max(...questions.map(q => q.id)) + 1, question: values.question, answers: finalAnswers };
        const newQuestions = [...questions, newQuestion];
        setQuestions(newQuestions);
        setFilteredQuestions(newQuestions);
        setPagination(prev => ({ ...prev, total: newQuestions.length }));
        message.success('添加题目成功');
      }
      setModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    setFilteredQuestions(newQuestions.filter(q => q.question.toLowerCase().includes(keyword.toLowerCase())));
    setPagination(prev => ({ ...prev, total: newQuestions.length }));
    message.success('删除题目成功');
  };

  const addOption = () => setAnswers([...answers, { text: '' }]);
  const removeOption = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    if (correctIndex === index) setCorrectIndex(-1);
    else if (correctIndex > index) setCorrectIndex(correctIndex - 1);
  };
  const updateOption = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '题目内容', dataIndex: 'question', ellipsis: true },
    {
      title: '所有选项', width: 300,
      render: (_, record) => record.answers?.map((a, i) => <span key={i} style={{ marginRight: 10 }}>{String.fromCharCode(65 + i)}. {a.text}</span>) || '-',
    },
    {
      title: '正确选项', width: 100,
      render: (_, record) => record.answers?.map((a, i) => a.correct ? String.fromCharCode(65 + i) : '').filter(x => x).join(', ') || '-',
    },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" onClick={() => openEditModal(record)}>编辑</Button>
          <Popconfirm title="确定要删除该题目吗?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>题目管理</h2>
      <Space style={{ marginBottom: 20 }}>
        <Input placeholder="请输入题目关键词" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 200 }} />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button type="primary" className="add-btn" onClick={openAddModal}>添加题目</Button>
      </Space>
      <Table columns={columns} dataSource={filteredQuestions} rowKey="id" loading={loading}
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: t => `共 ${t} 条`,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }) }} />

      <Modal title={isEdit ? '编辑题目' : '添加题目'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSubmit} width={600} destroyOnClose>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="题目内容" name="question" rules={[{ required: true, message: '请输入题目内容' }]}>
            <Input.TextArea rows={3} placeholder="请输入题目内容" />
          </Form.Item>
          <Divider orientation="left">选项</Divider>
          {answers.map((answer, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ width: 60 }}>选项 {index + 1}</span>
              <Input value={answer.text} onChange={e => updateOption(index, e.target.value)} placeholder="请输入选项内容" style={{ flex: 1 }} />
              <Radio checked={correctIndex === index} onChange={() => setCorrectIndex(index)} style={{ marginLeft: 10 }}>正确答案</Radio>
              {answers.length > 2 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeOption(index)} />}
            </div>
          ))}
          <Button type="dashed" onClick={addOption} icon={<PlusOutlined />}>添加选项</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Question;
