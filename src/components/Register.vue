<template>
    <div class="register">
        <div class="register_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/old_eight.jpg" title="老八蜜汁小憨包" @click="goLogin">
            </div>
            <!-- 登陆表单区域 -->
            <el-form label-width="0px" class="register_form" :model="user" :rules="register_rules" ref="registerRef">
                <el-form-item prop="account">
                    <!-- 用户名 -->
                    <el-input prefix-icon="el-icon-user" v-model="user.account" placeholder="点击上方图片进入登陆页面"></el-input>
                </el-form-item>
                <el-form-item prop="nickname">
                    <!-- 昵称 -->
                    <el-input prefix-icon="el-icon-lock" v-model="user.nickname" placeholder="输入昵称"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- 密码 -->
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="user.password" placeholder="输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPassword">
                    <!-- 确认密码 -->
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="user.checkPassword"
                        placeholder="确认上次输入密码"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <!-- 按钮区域 -->
                    <el-button type="primary" @click="registerUser">注册</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            // 自定义验证
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.user.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback();
                }
            };
            return {
                // 登陆表单
                user: {
                    nickname: '',
                    account: '',
                    password: '',
                    checkPassword: ''
                },
                // 表单验证
                register_rules: {
                    // 验证账号
                    nickname: [
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证账号
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证密码
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                    ],
                    // 验证第二次输入密码
                    checkPassword: [
                        { validator: validatePass, trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 重置表单
            reset() {
                this.$refs.registerRef.resetFields();
            },
            registerUser() {
                this.$refs.registerRef.validate(async valid => {
                    if (!valid) return;
                    const result = await this.$http.post("/user/register", this.user);
                    var data = result.data;
                    this.basic(result.status, data)
                    this.$message.success(data.msg)
                    this.$router.push({ path: '/login' })
                });
            },
            goLogin() {
                this.$router.push({ path: '/login' })
            }
        }
    }
</script>

<style lang="less" scoped>
    .register {
        background-color: #2b4b6b;
        height: 100%;
    }

    .register_box {
        width: 450px;
        height: 370px;
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

    .register_form {
        position: absolute;
        bottom: -18px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>