<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/old_eight.jpg" class="avatar_box" />
        <span>您好，用户：{{nickname}}</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部区 -->
    <!-- 主体区 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
    <!-- 主体区 -->
  </el-container>
</template>

<script>
export default {
  created() {
    // 自动加载请求
    this.getLoginInfo()
  },
  data() {
    return {
      nickname: "",
      msg: "",
      isShow: false
    };
  },
  methods: {
    logout() {
      var that = this;
      // 清空session
      window.sessionStorage.clear();
      // 跳转登陆
      this.$router.push("/login")
      // 服务器退出
      this.$http.get("/user/logout").then(function(result) {
        that.msg = result.data.msg;
        // 展示信息
        that.$message.success(that.msg)
      });
    },
    async getLoginInfo() {
      const result = await this.$http.get("/user/getLoginInfo")
      if (result.status !== 200)
        return this.$message.error("服务器出现问题，请联系系统管理员")
      if (result.data.code === 3) {
        // 跳转登陆
        this.$router.push("/login");
        this.$router.go(0)
        return this.$message.error(result.data.msg)
      } else {
        if (result.data.code === 1) {
          return this.$message.error(result.data.msg)
        }
        this.isShow = !this.isShow;
        const user = result.data.data;
        this.nickname = user.nickname;
        if (user.role === "admin") {
          this.$router.push({ path: "/adminHome" })
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
</style>