import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Space } from 'antd';
import { UserOutlined, QuestionCircleOutlined, DownOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = 'admin';

  const menuItems = [
    { key: '/user', icon: <UserOutlined />, label: '用户管理' },
    { key: '/question', icon: <QuestionCircleOutlined />, label: '题目管理' },
  ];

  const dropdownItems = [{ key: 'logout', label: '退出登录' }];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={styles.header}>
        <div style={styles.logo}>Quiz管理系统</div>
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer', color: '#1890ff' }}>
            {username}<DownOutlined />
          </Space>
        </Dropdown>
      </Header>
      <AntLayout>
        <Sider width={200} style={{ background: 'rgb(238, 241, 246)' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0, background: 'rgb(238, 241, 246)' }}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgb(238, 241, 246)',
    padding: '0 24px',
  },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
};

export default Layout;
