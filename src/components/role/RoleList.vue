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
        <el-col :span="7">
          <el-input
            placeholder="请输入权限名称"
            v-model="queryParams.name"
            clearable
            @clear="getAllMenuList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getAllMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialog = true">添加权限</el-button>
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
      <el-form label-width="70px" :model="menu" :rules="dialogRules" ref="addRef">
        <el-form-item prop="name" label="名称">
          <!-- 名称 -->
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路径">
          <!-- 路径 -->
          <el-input v-model="menu.path"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <!-- 状态 -->
          <el-switch v-model="menu.status" inactive-text="关闭" active-text="开启"></el-switch>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <!-- 选择权限 -->
          <el-select v-model="menu.role" placeholder="请选择权限">
            <el-option
              v-for="role in roleList"
              :key="role.role"
              :label="role.role"
              :value="role.role"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewMenu()">确 定</el-button>
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
          <el-input v-model="editDialogFrom.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="路径">
          <!-- 路径 -->
          <el-input v-model="editDialogFrom.path"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <!-- 状态 -->
          <el-switch v-model="menu.status" inactive-text="关闭" active-text="开启"></el-switch>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <!-- 选择权限 -->
          <el-select v-model="editDialogFrom.role" placeholder="请选择权限">
            <el-option
              v-for="role in roleList"
              :key="role.role"
              :label="role.role"
              :value="role.role"
            />
          </el-select>
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
        name: ""
      },
      roleList: [],
      // 主菜单选择列表
      parentMenuList: [],
      roleList: [],
      total: 0,
      menu: {
        id: 0,
        status: false,
        name: "",
        path: "",
        icon: "",
        parentId: "",
        role: ""
      },
      menuStatus: {
        id: 0,
        mode: "",
        status: false
      },
      deleteMenu: {
        id: 0,
        mode: ""
      },
      isParent: false,
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
        role: [{ required: true, message: "请选择权限", trigger: "blur" }]
      },
      // 查询到的信息
      editDialogFrom: {}
    };
  },
  created() {
    this.getAllRoleList();
    this.getParentMenu();
    this.getRoleList();
    this.checkMenu("权限管理");
  },
  methods: {
    async getAllRoleList() {
      const result = await this.$http.get("/role/getRoleList", {
        params: this.queryParams
      });
      const data = result.data.data;
      this.basic(result.status, result.data);
      this.roleList = data.list;
      this.total = data.total;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryParams.count = newSize;
      this.getAllMenuList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage;
      this.getAllMenuList();
    },
    // 修改侧边栏状态
    async useStateChange(info) {
      this.menuStatus.id = info.id;
      this.menuStatus.status = info.status;
      this.menuStatus.mode = "operateStatus";
      const result = await this.$http.post(
        "/menu/operateMenu",
        this.menuStatus
      );
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
    async addNewMenu() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return;
        if (this.isParent) {
          this.menu.parentId = 0;
        }
        if (!this.isParent && this.menu.parentId === "") {
          return this.$message.error("请选择主菜单");
        }
        const result = await this.$http.post("/menu/addNewMenu", this.menu);
        var data = result.data;
        this.basic(result.status, data);
        this.addDialog = !this.addDialog;
        this.reload();
        return this.$message.success(data.msg);
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

      this.deleteMenu.id = id;
      this.deleteMenu.mode = "delete";
      const result = await this.$http.post(
        "/menu/operateMenu",
        this.deleteMenu
      );
      const data = result.data;
      this.basic(result.status, data);
      this.reload();
      return this.$message.success(data.msg);
    },
    // 展示信息编辑对话框
    async showEditDialog(id) {
      this.editDialog = !this.editDialog;
      const result = await this.$http.get("menu/getMenuInfo", {
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
        if (this.editDialogFrom.menuIsParent) {
          this.editDialogFrom.parentId = 0;
        }
        if (
          !this.editDialogFrom.menuIsParent &&
          this.editDialogFrom.parent === ""
        ) {
          return this.$message.error("请选择主菜单");
        }
        console.log(this.editDialogFrom.status);
        this.editDialogFrom.mode = "update";
        const result = await this.$http.post("/menu/operateMenu", {
          id: this.editDialogFrom.id,
          name: this.editDialogFrom.name,
          path: this.editDialogFrom.path,
          icon: this.editDialogFrom.icon,
          parentId: this.editDialogFrom.parentId,
          role: this.editDialogFrom.role,
          mode: "update"
        });
        var data = result.data;
        this.basic(result.status, data);
        this.editDialog = !this.editDialog;
        this.reload();
        return this.$message.success(data.msg);
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>