<template>
    <div class="login">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/dog.jpg" title="老八蜜汁小憨包" @click="goRegister">
            </div>
            <!-- 登陆表单区域 -->
            <el-form label-width="0px" class="login_form" :model="user" :rules="login_rules" ref="loginRef">
                <el-form-item prop="account">
                    <!-- 用户名 -->
                    <el-input prefix-icon="el-icon-user" v-model="user.account" placeholder="点击上方图片进入注册页面"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- 密码 -->
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="user.password" placeholder="输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <!-- 按钮区域 -->
                    <el-button type="primary" @click="loginUser">登陆</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 登陆表单
                user: {
                    account: 'f1ash',
                    password: '529719'
                },
                // 表单验证
                login_rules: {
                    // 验证账号
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证密码
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 重置表单
            reset() {
                this.$refs.loginRef.resetFields();
            },
            loginUser() {
                this.$refs.loginRef.validate(async valid => {
                    if (!valid) return;
                    const result = await this.$http.post("/user/login", this.user);
                    var data = result.data;
                    this.basic(result.status, data)
                    this.$message.success(data.msg)
                    window.sessionStorage.setItem("token", result.data.data)
                    this.$router.push({ path: '/home' })
                });
            },
            goRegister() {
                this.$router.push({ path: '/register' })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            background-color: #eee;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>