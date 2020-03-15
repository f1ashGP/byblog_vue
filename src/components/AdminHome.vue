<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/dog.jpg" class="avatar_box" />
        <span>ByBlog管理页面</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部区域 -->
    <!-- 主要区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
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
    this.getMenuList();
  },
  data() {
    return {
      msg: "",
      menusList: [],
      isCollapse: false
    };
  },
  methods: {
    logout() {
      var that = this;
      // 清空session
      window.sessionStorage.clear();
      // 跳转登陆
      this.$router.push("/login");
      // 服务器退出
      this.$http.get("/user/logout").then(function(result) {
        that.msg = result.data.msg;
        // 展示信息
        that.$message.success(that.msg);
      });
    },
    // 获取所有菜单
    async getMenuList() {
      const result = await this.$http.get("/menu/getMenuList");
      if (result.status !== 200)
        return this.$message.error("服务器出现问题，请联系系统管理员");
      if (result.data.code !== 0) return this.$message.error(result.data.msg);
      this.menusList = result.data.data;
    },
    // 点击按钮切换菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.avatar_box {
  height: 65px;
  width: 70px;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>