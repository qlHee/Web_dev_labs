<template>
  <div class="user-container">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>
    
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="请输入用户名关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUsers">搜索</el-button>
        <el-button type="success" @click="openAddDialog">添加用户</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 用户表格 -->
    <el-table :data="userList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userRole === 1 ? 'danger' : 'info'">
            {{ scope.row.userRole === 1 ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" @click="resetUserPassword(scope.row)" :disabled="scope.row.userRole === 1">重置密码</el-button>
          <el-button size="mini" type="danger" @click="confirmDelete(scope.row)" :disabled="scope.row.userRole === 1">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input v-model="addForm.checkpassword" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userrole">
          <el-select v-model="addForm.userrole" placeholder="请选择用户类型">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser" :loading="addLoading">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password" placeholder="留空则不修改密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditUser" :loading="editLoading">保 存</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    // 自定义验证器：确认密码验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      // 用户列表
      userList: [],
      loading: false,
      
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      
      // 搜索
      searchForm: {
        keyword: ''
      },
      
      // 添加用户
      addDialogVisible: false,
      addLoading: false,
      addForm: {
        username: '',
        password: '',
        checkpassword: '',
        userrole: '0'
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        checkpassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        userrole: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      },
      
      // 编辑用户
      editDialogVisible: false,
      editLoading: false,
      editForm: {
        id: null,
        userName: '',
        password: ''
      },
      editFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.fetchUserList();
  },
  methods: {
    // 获取用户列表
    fetchUserList() {
      this.loading = true;
      const params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        keyword: this.searchForm.keyword
      };
      
      this.$axios.get('/user/list', { params })
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.userList = res.data.records || res.data.list || res.data;
            this.pagination.total = res.data.total || this.userList.length;
          } else {
            this.$message.error(res.msg || '获取用户列表失败');
          }
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取用户列表失败');
          this.loading = false;
        });
    },
    
    // 搜索用户
    searchUsers() {
      this.pagination.currentPage = 1;
      this.fetchUserList();
    },
    
    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchUserList();
    },
    
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchUserList();
    },
    
    // 打开添加用户对话框
    openAddDialog() {
      this.addForm = {
        username: '',
        password: '',
        checkpassword: '',
        userrole: '0'
      };
      this.addDialogVisible = true;
      // 重置表单验证
      if (this.$refs.addForm) {
        this.$refs.addForm.clearValidate();
      }
    },
    
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          this.$axios.post('/addUser', this.addForm)
            .then(response => {
              const res = response.data;
              if (res.code === 1) {
                this.$message.success('添加用户成功');
                this.addDialogVisible = false;
                this.fetchUserList();
              } else {
                this.$message.error(res.msg || '添加用户失败');
              }
              this.addLoading = false;
            })
            .catch(error => {
              console.error(error);
              this.$message.error('添加用户失败');
              this.addLoading = false;
            });
        }
      });
    },
    
    // 重置用户密码
    resetUserPassword(row) {
      this.$confirm('确定要重置该用户的密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/user/resetPassword', { id: row.id })
          .then(response => {
            const res = response.data;
            if (res.code === 1) {
              this.$message.success('密码重置成功，新密码为: 123456');
            } else {
              this.$message.error(res.msg || '密码重置失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('密码重置失败');
          });
      }).catch(() => {});
    },
    
    // 确认删除用户
    confirmDelete(row) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(row.id);
      }).catch(() => {});
    },
    
    // 删除用户
    deleteUser(id) {
      this.$axios.delete(`/user/delete/${id}`)
        .then(response => {
          const res = response.data;
          if (res.code === 1) {
            this.$message.success('删除用户成功');
            this.fetchUserList();
          } else {
            this.$message.error(res.msg || '删除用户失败');
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('删除用户失败');
        });
    },
    
    // 打开编辑用户对话框
    openEditDialog(row) {
      this.editForm = {
        id: row.id,
        userName: row.userName,
        password: ''
      };
      this.editDialogVisible = true;
      if (this.$refs.editForm) {
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate();
        });
      }
    },
    
    // 保存编辑用户
    saveEditUser() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editLoading = true;
          this.$axios.post('/user/update', this.editForm)
            .then(response => {
              const res = response.data;
              if (res.code === 1) {
                this.$message.success('用户更新成功');
                this.editDialogVisible = false;
                this.fetchUserList();
              } else {
                this.$message.error(res.msg || '用户更新失败');
              }
              this.editLoading = false;
            })
            .catch(error => {
              console.error(error);
              this.$message.error('用户更新失败');
              this.editLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
