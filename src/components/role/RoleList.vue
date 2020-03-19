<template>
  <div>
    <!-- 面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入侧边栏名称" v-model.trim="queryParams.name" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryParams.role" placeholder="请选择权限">
            <el-option key="normal" label="normal" value="normal" />
            <el-option key="admin" label="admin" value="admin" />
            <el-option key="admin,normal" label="admin,normal" value="admin,normal" />
          </el-select>
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
      <el-row style="margin-top:15px;">
        <el-col>
          <el-button type="primary" @click="addDialog = true">添加侧边栏</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" :border="false" :stripe="true">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="path">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.path !== ''">{{scope.row.path}}</span>
            <span v-else>无</span>
          </template>-->
        </el-table-column>
        <el-table-column label="权限" prop="role"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              inactive-text="关闭"
              active-text="开启"
              v-model="scope.row.status"
              @change="useStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="showEditDialog(scope.row.id)" :underline="false">编辑</el-link>
            <el-link
              type="danger"
              @click="remove(scope.row.id)"
              style="margin-left: 10px;"
              :underline="false"
            >删除</el-link>
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

    <!-- 添加对话框 -->
    <el-dialog title="权限添加" :visible.sync="addDialog" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <!-- 登陆表单区域 -->
      <el-form label-width="70px" :model="role" :rules="dialogRules" ref="addRef">
        <el-form-item prop="name" label="名称">
          <!-- 名称 -->
          <el-input v-model.trim="role.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路径">
          <!-- 路径 -->
          <el-input v-model.trim="role.path"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="roleName">
          <!-- 输入权限 -->
          <el-input v-model.trim="role.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加对话框 -->
    <!-- 修改对话框 -->
    <el-dialog
      title=" 权限修改"
      :visible.sync="editDialog"
      width="50%"
      :model="editDialogFrom"
      @close="editDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form label-width="70px" :model="editDialogFrom" :rules="dialogRules" ref="editRef">
        <el-form-item prop="name" label="名称">
          <!-- 名称 -->
          <el-input v-model.trim="editDialogFrom.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路径">
          <!-- 路径 -->
          <el-input v-model.trim="editDialogFrom.path"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="roleName">
          <!-- 输入权限 -->
          <el-input v-model.trim="editDialogFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <!-- 状态 -->
          <el-switch v-model="editDialogFrom.status" inactive-text="关闭" active-text="开启"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editInfoDialog()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
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
        status: null,
        role: null
      },
      roleList: [],
      roleNameList: [],
      total: 0,
      role: {
        status: true,
        name: "",
        path: "",
        roleName: ""
      },
      // 控制添加对话框显示与隐藏
      addDialog: false,
      // 控制修改对话框显示与隐藏
      editDialog: false,
      // 表单验证
      dialogRules: {
        // 验证名称
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "请输入权限，用逗号隔开", trigger: "blur" }
        ],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }]
      },
      // 查询到的信息
      editDialogFrom: {}
    };
  },
  created() {
    this.getAllRoleList();
    this.checkMenu("权限管理");
  },
  methods: {
    async getAllRoleList() {
      const result = await this.$http.get("/role/getRoleList", {
        params: this.queryParams
      });
      const data = result.data.data;
      if (result.data.msg === "暂无数据") {
        this.roleList = "";
        this.total = "";
      }
      if (result.data.code === 0) {
        this.roleList = data.list;
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
      const result = await this.$http.post("/role/operateRole", {
        id: info.id,
        status: info.status,
        mode: "operateStatus"
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
    // 增加
    async addNewRole() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return;
        const result = await this.$http.post("/role/addNewRole", this.role);
        var data = result.data;
        this.basic(result.status, data);
        this.addDialog = !this.addDialog;
        this.reload();
        if (data.code === 0) return this.$message.success(data.msg);
      });
    },
    // 删除
    async remove(id) {
      // 询问是否删除
      const confirm = await this.$confirm(
        "此操作将永久删除该侧边栏, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirm !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const result = await this.$http.post("/role/operateRole", {
        id: id,
        mode: "delete"
      });
      const data = result.data;
      this.reload();
      this.basic(result.status, data);
      if (data.code === 0) return this.$message.success(data.msg);
    },
    // 展示信息编辑对话框
    async showEditDialog(id) {
      this.editDialog = !this.editDialog;
      const result = await this.$http.get("role/getRoleInfo", {
        params: {
          id: id
        }
      });
      const data = result.data;
      this.basic(result.status, data);
      this.editDialogFrom = result.data.data;
    },
    // 监听修改对话框的关闭事件
    addDialogClosed() {
      this.$refs.addRef.resetFields();
    },
    // 监听新增对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRef.resetFields();
    },
    // 修改
    async editInfoDialog() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return;
        this.editDialogFrom.mode = "update";
        const result = await this.$http.post("/role/operateRole", {
          id: this.editDialogFrom.id,
          name: this.editDialogFrom.name,
          path: this.editDialogFrom.path,
          roleName: this.editDialogFrom.roleName,
          mode: "update"
        });
        var data = result.data;
        this.basic(result.status, data);
        this.editDialog = !this.editDialog;
        this.reload();
        if (data.code === 0) return this.$message.success(data.msg);
      });
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