<template>
    <div>
        <table>
            <tr>
                <td><span>你好，用户：{{nickname}}</span></td>
            </tr>
            <tr>
                <td><el-button type="info" @click="logout">退出</el-button></td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        created() {
            // 自动加载请求
            this.getLoginInfo();
        },
        data() {
            return {
                nickname: '',
                msg: ''
            }
        },
        methods: {
            logout() {
                var that = this;
                // 清空session
                window.sessionStorage.clear();
                // 跳转登陆
                this.$router.push('/login');
                // 服务器退出
                this.$http.get("/user/logout")
                    .then(function (result) {
                        that.msg = result.data.msg;
                        // 展示信息
                        that.$message.success(that.msg)
                    })
            },
            async getLoginInfo() {
                const result = await this.$http.get("/user/getLoginInfo")
                if (result.status !== 200) return this.$message.error('服务器出现问题，请联系系统管理员');
                this.nickname = result.data.data.nickname
            }
        }
    };
</script>

<style lang="less" scoped>

</style>