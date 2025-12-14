import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { mockScores } from '../data/mockData';

const Score = () => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setScores([...mockScores]);
      setFilteredScores([...mockScores]);
      setPagination(prev => ({ ...prev, total: mockScores.length }));
      setLoading(false);
    }, 300);
  }, []);

  const handleSearch = () => {
    const filtered = scores.filter(s => s.userName.toLowerCase().includes(keyword.toLowerCase()));
    setFilteredScores(filtered);
    setPagination(prev => ({ ...prev, current: 1, total: filtered.length }));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'userName' },
    { title: '得分', dataIndex: 'score' },
    { title: '正确题数', dataIndex: 'correctCount' },
    { title: '总题数', dataIndex: 'totalQuestions' },
    {
      title: '正确率',
      render: (_, record) => `${((record.correctCount / record.totalQuestions) * 100).toFixed(1)}%`,
    },
    { title: '答题时间', dataIndex: 'createTime', width: 180 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>评分查询</h2>
      <Space style={{ marginBottom: 20 }}>
        <Input placeholder="请输入用户名关键词" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 200 }} />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
      </Space>
      <Table columns={columns} dataSource={filteredScores} rowKey="id" loading={loading}
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: t => `共 ${t} 条`,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }) }} />
    </div>
  );
};

export default Score;
