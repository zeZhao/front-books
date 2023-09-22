<template>
	<div class="downloadCenter">
		<div class="search">
			<el-form :model="searchForm" :inline="true">
				<el-form-item label="书籍名称：">
					<el-input v-model="searchForm.bootName" placeholder="请输入书籍名称"></el-input>
				</el-form-item>
				<el-form-item label="ISBN：">
					<el-input v-model="searchForm.isbn" placeholder="请输入ISBN" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属幼儿园：">
					<el-select v-model="searchForm.kindergarten" placeholder="请选择所属幼儿园" clearable>
						<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类别：">
					<el-select v-model="searchForm.category" placeholder="请选择类别" clearable>
						<el-option v-for="item in categoryList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期：">
					<el-date-picker v-model="searchForm.searchDate" type="date" placeholder="选择日期"
						value-format="yyyy-MM-dd">
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
		<el-table :data="tableData" style="width: 100%; margin-top: 10px" :header-cell-style="{
        background: '#FAFAFA',
        borderBottom: '1px solid #fff',
      }" highlight-current-row>
			<el-table-column prop="id" label="编号"> </el-table-column>
			<el-table-column prop="isbn" label="图书ISBN"> </el-table-column>
			<el-table-column prop="name" label="图书名称" width="150"> </el-table-column>
			<el-table-column prop="cover" label="图书封面">
				<template slot-scope="{row}">
					<el-image :src="row.cover" style="width:100px;height:100px"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="author" label="图书作者"> </el-table-column>
			<el-table-column prop="categoryName" label="类别"> </el-table-column>
			<el-table-column prop="pages" label="页数"> </el-table-column>
			<!-- <el-table-column prop="kindergartenName" label="所属幼儿园"> </el-table-column> -->
			<el-table-column prop="path" label="音视频存储路径"> </el-table-column>
			<el-table-column prop="time" label="日期"> </el-table-column>

			<el-table-column label="操作">
				<template slot-scope="{ row }">
					<span class="handle" @click="update(row)">修改</span>
					<span class="handle" @click="deleteDownload(row)">删除</span>
					<!-- <el-button
            size="small"
            type="text"
            @click="newQrcode(row)"
            v-if="!row.qr"
            >点击生成二维码</el-button
          > -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background layout="total, sizes, prev, pager, next" :total="total"
			:current-page.sync="searchForm.pageNum" :page-size="searchForm.pageSize" @size-change="sizeChange"
			@current-change="currentChange">
		</el-pagination>

		<el-dialog title="书籍操作" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
			<el-form :model="form" label-width="100px" ref="form" :rules="rules">

				<el-form-item label="书籍名称：" prop="name">
					<el-input v-model="form.name" placeholder="请输入书籍名称"></el-input>
				</el-form-item>
				<el-form-item label="图书封面：" prop="cover">
					<el-upload ref="cover" :limit="1" :file-list="cover" :action="action" :headers="headers"
						list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
						:on-success="handleSuccess" :before-upload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="图书作者：" prop="author">
					<el-input v-model="form.author" placeholder="请输入图书作者"></el-input>
				</el-form-item>
				<el-form-item label="书籍类别：" prop="category">
					<el-select v-model="form.category" placeholder="请选择书籍类别">
						<el-option v-for="item in categoryList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="所属幼儿园：" prop="kindergarten">
					<el-select v-model="form.kindergartenIds" placeholder="请选择所属幼儿园" multiple >
						<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="图书ISBN：" prop="isbn">
					<el-input v-model="form.isbn" placeholder="请输入图书ISBN"></el-input>
				</el-form-item>
				<el-form-item label="书籍页数：" prop="pages">
					<el-input v-model="form.pages" placeholder="请输入书籍页数"></el-input>
				</el-form-item>
				<el-form-item label="音频文件：" prop="audioFile">
					<el-upload
					ref="uploadMp3"
					  drag
					  :limit="1" 
					   :action="action"
					   :headers="headers"
					   :on-remove="handleRemoveMp3"
					   :on-success="handleSuccessMp3" 
					  multiple>
					  <i class="el-icon-upload"></i>
					  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-form-item>
				<el-form-item label="音视频路径：" prop="path">
					<el-input v-model="form.path" placeholder="请输入书籍音视频路径"></el-input>
				</el-form-item>
				<el-form-item label="图书简介：" prop="briefIntro">
					<el-input v-model="form.briefIntro" placeholder="请输入图书简介" type="textarea"></el-input>
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
				<el-button @click="cancel">取 消</el-button>
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
		append,
		update,
		remove,
		commonUpload,
	} from "@/api/book";
	import {
		kindergartenList,
		categoryList
	} from "@/api/select"
	import QRCode from "qrcodejs2";
	import {
		setStorage,
		getStorage
	} from "@/utils/auth";

	export default {
		components: {},
		data() {
			return {
				searchForm: {
					bootName: "",
					isbn: "",
					kindergarten: "",
					category: "",
					searchDate: "",
					pageNum: 1,
					pageSize: 10,
				},
				//表格数据
				tableData: [],
				total: 0,
				dialogFormVisible: false,
				form: {
					name: "",
					cover: "",
					author: "",
					category: "",
					kindergarten: '',
					kindergartenIds: [],
					isbn: "",
					pages: "",
					path: "",
					qr: "",
					time: "",
					briefIntro: "",
				},
				rules: {
					name: [{
						required: true,
						message: '请填写名称',
						trigger: 'blur'
					}],
					cover: [{
						required: true,
						message: '请选择封面',
						trigger: ['blur','change']
					}],
					author: [{
						required: true,
						message: '请填写作者',
						trigger: 'blur'
					}],
					category: [{
						required: true,
						message: '请选择图书类别',
						trigger: ['blur','change']
					}],
					// kindergarten: [{
					// 	required: true,
					// 	message: '请选择幼儿园',
					// 	trigger: ['blur','change']
					// }],
					isbn: [{
						required: true,
						message: '请填写ISBN',
						trigger: 'blur'
					}],
					pages: [{
						required: true,
						message: '请填写页数',
						trigger: 'blur'
					}],
				},
				id: "",
				// validator
				dialogImageUrl: "",
				dialogVisible: false,
				action: process.env.VUE_APP_BASE_API + "/sys/common/upload",
				cover: [],
				attachment: [],
				submitDisabled: false,
				headers: {
					Authorization: getStorage('token')
				},
				kindergartenList: [],
				categoryList: [],
			};
		},
		created() {
			this.getKindergartenList();
			this.getCategoryList();
		},
		mounted() {
			this.getQueryByPage();

		},
		computed: {},
		methods: {
			//查询幼儿园
			getKindergartenList() {
				kindergartenList().then(res => {
					this.kindergartenList = res.data
					console.log(res, '======')
				})
			},
			//查询类别
			getCategoryList() {
				categoryList().then(res => {
					this.categoryList = res.data
				})
			},
			//列表查询
			getQueryByPage() {
				queryByPage(this.searchForm).then((res) => {
					// if()
					this.tableData = res.data.records;
					this.total = res.data.total;
					this.tableData.forEach(item => {
						if (item.kindergarten) {
							this.kindergartenList.forEach(el => {
								if (item.kindergarten == el.id) {
									item.kindergartenName = el.name
								}
							})
						}
						if (item.category) {
							this.categoryList.forEach(el => {
								if (item.category == el.id) {
									item.categoryName = el.name
								}
							})
						}
					})
				});
			},
			cancel(){
				this.dialogFormVisible = false
				this.$refs.uploadMp3.clearFiles()
			},
			//新增修改提交
			sendMailAndSms() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						let obj = JSON.parse(JSON.stringify(this.form));
						if (this.id) {
							update({
								...obj,
								id: this.id
							}).then((res) => {
								update({
									...obj,
									qr: ''
								}).then(res => {
									this.getQueryByPage();
									this.dialogFormVisible = false;
									this.$refs.uploadMp3.clearFiles()
								})
								// this.getQueryByPage();

							});
						} else {
							append({
								...obj
							}).then((res) => {
								this.getQueryByPage();
								this.dialogFormVisible = false;
								this.$refs.uploadMp3.clearFiles()
							});
						}
					}
				});
			},
			//修改（调整数据）
			update(row) {
				this.id = row.id;
				console.log(row,'==================')
				row.category = Number(row.category)
				this.form = Object.assign(row);
				this.dialogFormVisible = true;
				this.cover = []
				this.cover.push({
					url: this.form.cover
				})
			},
			//图片转换
			base64ToFile(base64, fileName) {
				const arr = base64.split(",");
				const type = arr[0].match(/:(.*?);/)[1];
				const bstr = atob(arr[1]);
				let n = bstr.length;
				const u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], fileName, {
					type
				});
			},
			//生成二维码
			newQrcode(data) {
				this.$refs.qrcode.innerHTML = ""; // 清空之前生成的二维码内容
				let qrcode = new QRCode("qrcode", {
					width: 100, // 设置宽度，单位像素
					height: 100, // 设置高度，单位像素
					colorDark: "#000000", // 二维码颜色
					colorLight: "#ffffff", // 背景颜色
					correctLevel: QRCode.CorrectLevel.H, // 校正水准
					text: JSON.stringify(data), // 设置二维码内容或跳转地址(完整链接)
					correctLevel: 0
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
						update({
							...data,
							qr: res.file
						}).then(res => {
							this.getQueryByPage();
						})
					});
				});
			},
			//上传验证
			beforeAvatarUpload(file) {
				let arr = ["image/jpeg", "image/png", "image/jpg"];
				if (!arr.includes(file.type)) {
					this.$message.error("只能上传图片格式!");
				}
				return arr.includes(file.type);
			},
			//上传成功
			handleSuccessMp3(res, file, fileList) {
				console.log(res, ';----------')
				if(res.code === 500){
					this.$refs.uploadMp3.clearFiles()
				}else{
					this.form.path = res.url;
				}
				
			},
			//上传-删除
			handleRemoveMp3(file, fileList) {
				this.form.path = "";
			},
			//上传成功
			handleSuccess(res, file, fileList) {
				console.log(res, ';----------')
				this.form.cover = res.url;
			},
			//上传-删除
			handleRemove(file, fileList) {
				this.form.cover = "";
			},
			//上传查看图片
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
						remove(row.id).then((res) => {
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
			//新增
			send(row) {
				// if(this.$refs.qrcode){
				//   this.$refs.qrcode.innerHTML = ""
				// }

				for (let key in this.form) {
					if(key == 'kindergartenIds'){
						this.form[key] = [];
					}else{
						this.form[key] = "";
					}
					
				}
				this.id = "";
				this.cover = [];
				this.dialogFormVisible = true;
			},
			//分页
			sizeChange(val) {
				this.searchForm.pageSize = val;
				this.searchForm.pageNum = 1;
				this.getQueryByPage();
			},
			currentChange(val) {
				this.searchForm.pageNum = val;
				this.getQueryByPage();
			},

			//查询
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