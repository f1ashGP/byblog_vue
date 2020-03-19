<template>
  <div>
    <!-- 面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入用户昵称" v-model.trim="queryParams.name" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option key="false" label="关闭" value="false" />
            <el-option key="true" label="开启" value="true" />
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="getAllRoleList">查询</el-button>
        </el-col>
        <el-col :span="1">
          <el-button @click="reloadPage" style="margin-left:15px;">清除</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" :border="false" :stripe="true">
        <el-table-column label="用户账号" prop="username"></el-table-column>
        <el-table-column label="用户昵称" prop="nickname">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.path !== ''">{{scope.row.path}}</span>
            <span v-else>无</span>
          </template>-->
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="权限" prop="role"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              inactive-text="冻结"
              active-text="未冻结"
              v-model="scope.row.freeze"
              @change="useStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上次登录时间" prop="lastLoginTime" sortable></el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable></el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.page"
        :page-sizes="[10, 100, 150]"
        :page-size="queryParams.count"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      // 刷新页面
      // 获取请求参数对象
      queryParams: {
        page: 1,
        count: 10,
        name: "",
        status: null
      },
      userList: [],
      total: 0,
    };
  },
  created() {
    this.getAllRoleList();
    this.checkMenu("用户管理");
  },
  methods: {
    async getAllRoleList() {
      const result = await this.$http.get("/user/getUserList", {
        params: this.queryParams
      });
      const data = result.data.data;
      if (result.data.msg === "暂无数据") {
        this.userList = "";
        this.total = "";
      }
      if (result.data.code === 0) {
        this.userList = data.list;
        this.total = data.total;
        this.basic(result.status, result.data);
      }
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryParams.count = newSize;
      this.getAllRoleList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage;
      this.getAllRoleList();
    },
    // 修改侧边栏状态
    async useStateChange(info) {
      const result = await this.$http.post("/user/operateUser", {
        id: info.id,
        status: info.freeze
      });
      const data = result.data;
      this.basic(result.status, "");
      this.reload();
      if (data.code === 0) {
        return this.$message.success(data.msg);
      } else {
        return this.$message.error(data.msg);
      }
    },
    // 查询清除
    reloadPage() {
      this.reload();
    }
  }
};
</script>

<style lang="less" scoped>
</style>