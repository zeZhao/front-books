<template>
  <div class="downloadCenter">
    <div class="search">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="书籍名称：">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入书籍名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属幼儿园：">
          <el-input
            v-model="searchForm.kindergarten"
            placeholder="请输入所属幼儿园"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="searchForm.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-input
            v-model="searchForm.downloadContent"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="send">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="qrcode" ref="qrcode" style="display:none"></div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      :header-cell-style="{
        background: '#FAFAFA',
        borderBottom: '1px solid #fff',
      }"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="cover" label="图书封面">
        <template slot-scope="{row}">
          <el-image :src="row.cover" style="width:100px;height:100px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="日期"> </el-table-column>
      <el-table-column prop="kindergarten" label="幼儿园记录">
      </el-table-column>
      <el-table-column prop="qr" label="图书二维码">
        <template slot-scope="{row}">
          <el-image :src="row.qr" :preview-src-list="[row.qr]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <span class="handle" @click="update(row)">修改</span>
          <span class="handle" @click="deleteDownload(row)">删除</span>
          <el-button
            size="small"
            type="text"
            @click="newQrcode(row)"
            v-if="!row.qr"
            >点击生成二维码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :current-page.sync="searchForm.pageNumber"
      :page-size="searchForm.pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
    </el-pagination>

    <el-dialog
      title="书籍操作"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" ref="form">
        <el-form-item label="书籍名称：" prop="recipient">
          <el-input v-model="form.name" placeholder="请输入书籍名称"></el-input>
        </el-form-item>
        <el-form-item label="所属幼儿园：" prop="kindergarten">
          <el-input
            v-model="form.kindergarten"
            placeholder="请输入所属幼儿园"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期：" prop="ccPerson">
          <el-date-picker
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图书封面：" prop="cover">
          <el-upload
            ref="cover"
            :limit="1"
            :file-list="cover"
            :action="action"
            :headers="headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="图书二维码：" prop="attachment">
          <el-button
            size="small"
            type="primary"
            @click="qrcode('点击生成二维码')"
            v-if="isQrcode"
            >点击生成二维码</el-button
          >
          <div id="qrcode" ref="qrcode" style=""></div>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendMailAndSms">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  queryByPage,
  insertBoot,
  update,
  deteleBoot,
  upload,
} from "@/api/sysDownLoadLog";
import QRCode from "qrcodejs2";
import { setStorage, getStorage } from "@/utils/auth";

export default {
  components: {},
  data() {
    return {
      searchForm: {
        name: "",
        time: "",
        pageNumber: 1,
        pageSize: 10,
      },
      //表格数据
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {
        qr: "",
        kindergarten: "",
        name: "",
        time: "",
        cover: "",
      },
      id: "",
      // validator
      rules: {
        recipient: [
          {
            required: true,
            type: "email",
            message: "请输正确的邮箱格式",
            trigger: "blur",
          },
        ],
        ccPerson: [
          {
            required: true,
            type: "email",
            message: "请输正确的邮箱格式",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            pattern: /^(1[3-9][0-9]{9})$/,
            message: "请输正确的手机号格式",
            trigger: "blur",
          },
        ],
        subject: [
          {
            required: true,
            message: "请输入邮箱标题",
            trigger: "blur",
          },
        ],
        text: [
          {
            required: true,
            message: "请输入正文内容",
            trigger: "blur",
          },
        ],
      },
      multipleSelection: [],
      dialogImageUrl: "",
      dialogVisible: false,
      action: process.env.VUE_APP_BASE_API + "/upload",
      cover: [],
      attachment: [],
      submitDisabled: false,
      headers:{
        token:getStorage('token')
      }
    };
  },
  created() {},
  mounted() {
    this.getQueryByPage();
  },
  computed: {},
  methods: {
    sendMailAndSms() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form));
          if (this.id) {
            update({ ...obj, id: this.id }).then((res) => {
              update({ ...obj,qr:'' }).then(res=>{
                this.getQueryByPage();
                this.dialogFormVisible = false;
              })
              // this.getQueryByPage();
              
            });
          } else {
            insertBoot({ ...obj }).then((res) => {
              this.getQueryByPage();
              this.dialogFormVisible = false;
            });
          }
        }
      });
    },
    update(row) {
      this.id = row.id;
      this.form = Object.assign(row);
      this.dialogFormVisible = true;
      this.cover = []
      this.cover.push({
        url:this.form.cover
      })
    },
    base64ToFile(base64, fileName) {
      const arr = base64.split(",");
      const type = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type });
    },
    newQrcode(data) {
      this.$refs.qrcode.innerHTML = ""; // 清空之前生成的二维码内容
      let qrcode = new QRCode("qrcode", {
        width: 100, // 设置宽度，单位像素
        height: 100, // 设置高度，单位像素
        colorDark: "#000000", // 二维码颜色
        colorLight: "#ffffff", // 背景颜色
        correctLevel: QRCode.CorrectLevel.H, // 校正水准
        text: JSON.stringify(data), // 设置二维码内容或跳转地址(完整链接)
        correctLevel : 0
      });
      // this.isQrcode = false;
      setTimeout(() => {
        var file = this.base64ToFile(
          this.$refs.qrcode.childNodes[1].src,
          "二维码.png"
        );
        let formData = new FormData();
        formData.append("file", file);
        upload(formData).then((res) => {
          this.form.qr = res.file;  
          update({ ...data,qr:res.file }).then(res=>{
            this.getQueryByPage();
          })
        });
      });
    },
    beforeAvatarUpload(file) {
      let arr = ["image/jpeg", "image/png", "image/jpg"];
      if (!arr.includes(file.type)) {
        this.$message.error("只能上传图片格式!");
      }
      return arr.includes(file.type);
    },
    handleSuccess(res,file,fileList) {
      this.form.cover = res.file;
    },
    handleRemove(file, fileList) {
      this.form.cover = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = URL.createObjectURL(file.raw);
      this.dialogVisible = true;
    },
    //删除
    deleteDownload(row) {
      this.$confirm("删除后将不可找回，请谨慎操作", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deteleBoot({ id: row.id }).then((res) => {
            this.getQueryByPage();
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    send(row) {
      // if(this.$refs.qrcode){
      //   this.$refs.qrcode.innerHTML = ""
      // }

      for (let key in this.form) {
        this.form[key] = "";
      }
      this.id = "";
      this.cover = [];
      this.dialogFormVisible = true;
    },
    sizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNumber = 1;
      this.getQueryByPage();
    },
    currentChange(val) {
      this.searchForm.pageNumber = val;
      this.getQueryByPage();
    },
    getQueryByPage() {
      queryByPage(this.searchForm).then((res) => {
        this.tableData = res.bootList.list;
        this.total = res.bootList.total;
        if (res.code === 200) {
        }
      });
    },
    onSubmit() {
      this.getQueryByPage();
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.downloadCenter {
  padding: 24px 24px;
  background: #fff;

  .el-pagination {
    text-align: right;
    margin-top: 28px;
    // padding-bottom: 28px;
  }
  .el-link {
    padding-right: 12px;
    text-decoration: none;
  }
  .handle {
    padding-right: 10px;
    cursor: pointer;
    color: #409eff;
  }
}
</style>
