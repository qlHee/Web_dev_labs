<template>
  <div class="user-view">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch" class="custom-button">查询用户</el-button>
        <el-button type="success" @click="dialogVisible = true" class="custom-button">添加用户</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            class="custom-button">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            class="custom-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="100">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="新用户"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="userForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="custom-button">取 消</el-button>
        <el-button type="primary" @click="handleAddUser" class="custom-button">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      searchForm: {
        username: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          username: '王小虎',
          password: '123456'
        },
        {
          date: '2016-05-04',
          username: '王小虎',
          password: '123456'
        },
        {
          date: '2016-05-01',
          username: '王小虎',
          password: '123456'
        },
        {
          date: '2016-05-03',
          username: '王小虎',
          password: '123456'
        }
      ],
      currentPage: 1,
      dialogVisible: false,
      userForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    onSearch() {
      console.log('搜索用户:', this.searchForm.username)
      this.$message.success('查询用户')
    },
    handleEdit(index, row) {
      console.log('编辑用户:', index, row)
      this.$message.info('编辑用户')
    },
    handleDelete(index, row) {
      console.log('删除用户:', index, row)
      this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log('当前页:', val)
    },
    handleAddUser() {
      if (this.userForm.password !== this.userForm.confirmPassword) {
        this.$message.error('两次密码输入不一致')
        return
      }
      console.log('添加用户:', this.userForm)
      this.$message.success('添加用户成功')
      this.dialogVisible = false
      this.userForm = {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  }
}
</script>

<style scoped>
.user-view {
  padding: 20px;
}

.custom-button {
  transition: all 0.3s;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.el-form-item {
  margin-bottom: 20px;
}
</style>

