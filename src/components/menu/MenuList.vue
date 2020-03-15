<template>
  <div>
    <!-- 面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>侧边栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>侧边栏列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加侧边栏</el-button>
        </el-col>
      </el-row>
      <el-table :data="menusList" :border="true" :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span v-if="scope.row.name !== ''">{{scope.row.name}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <span v-if="scope.row.path !== ''">{{scope.row.path}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <span v-if="scope.row.icon !== null">{{scope.row.icon}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime !== null">{{scope.row.createTime}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="父级列表">
          <template slot-scope="scope">
            <span v-if="scope.row.parent !== null">{{scope.row.parent}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="开启/关闭">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
  data() {
    return {
      // 获取请求参数对象
      queryParams: {
        page: "1",
        count: "10"
      },
      menusList: [],
      total: 0
    };
  },
  created() {
    this.getAllMenuList();
  },
  methods: {
    async getAllMenuList() {
      const result = await this.$http.get("/menu/getAllMenuList", {
        params: this.queryParams
      });
      if (result.status !== 200)
        return this.$message.error("服务器出现问题，请联系系统管理员");
      const data = result.data.data;
      this.menusList = data.list;
      this.total = data.total;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
        this.queryParams.count = newSize
        this.getAllMenuList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getAllMenuList()
    }
  }
};
</script>

<style lang="less" scoped>
</style>