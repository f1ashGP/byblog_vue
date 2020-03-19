<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/dog.jpg" class="avatar_box" />
        <span style="font-size:14px;">ByBlog管理后台</span>
      </div>
      <el-link type="info" @click="logout" :underline="false" style="font-size:18px;">退出</el-link>
    </el-header>
    <!-- 头部区域 -->
    <!-- 主要区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="210px">
        <!-- 侧边栏菜单区 -->
        <el-menu
          text-color="#000000"
          active-text-color="#1E90FF"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :default-active="$router.path"
        >
          <el-submenu :index="menu.id + ''" v-for="menu in menusList" :key="menu.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="menu.icon"></i>
              <!-- 文本 -->
              <span>{{menu.name}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="childMenu.path"
              v-for="childMenu in menu.childMenuList"
              :key="childMenu.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{childMenu.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 左侧侧边栏 -->
      <!-- 主要内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <!-- 主要内容区域 -->
    </el-container>
    <!-- 主要区域 -->
  </el-container>
</template>

<script>
export default {
  created() {
    // 自动加载请求
    this.getMenuList()
  },
  data() {
    return {
      msg: "",
      menusList: []
    };
  },
  methods: {
    logout() {
      var that = this;
      // 清空session
      window.sessionStorage.clear()
      // 跳转登陆
      this.$router.push("/login");
      // 服务器退出
      this.$http.get("/user/logout").then(function(result) {
        that.msg = result.data.msg
        // 展示信息
        that.$message.success(that.msg)
      });
    },
    // 获取所有菜单
    async getMenuList() {
      const result = await this.$http.get("/menu/getMenuList")
      if (result.status !== 200)
        return this.$message.error("服务器出现问题，请联系系统管理员")
      if (result.data.code === 3) {
        // 跳转登陆
        this.$router.push("/login");
        return this.$message.error(result.data.msg)
      } else {
        if (result.data.code !== 0) {
          return this.$message.error(result.data.msg)
        } else {
          this.menusList = result.data.data
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  border: 1px solid #e3e3e3;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.avatar_box {
  height: 55px;
  width: 60px;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-aside {
  border: 1px solid #e3e3e3;
  .el-menu {
    border-right: 0;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>