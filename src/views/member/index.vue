<template>
	<div class="downloadCenter">
		<div class="search">
			<el-form :model="searchForm" :inline="true">
				<el-form-item label="会员名称：">
					<el-input v-model="searchForm.name" placeholder="请输入会员名称"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input v-model="searchForm.contact" placeholder="请输入联系电话"></el-input>
				</el-form-item>
				<el-form-item label="所属幼儿园：">
					<el-select v-model="searchForm.kindergarten" placeholder="请选择所属幼儿园" clearable @change="selectPark">
						<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属班级：">
					<el-select v-model="searchForm.classId" placeholder="请输入所属班级" clearable no-data-text="请先选择所属幼儿园">
						<el-option v-for="item in classList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click="send">新增</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%; margin-top: 10px" :header-cell-style="{
        background: '#FAFAFA',
        borderBottom: '1px solid #fff',
      }" highlight-current-row>
			<el-table-column prop="name" label="会员名称"> </el-table-column>
			<el-table-column prop="head" label="头像">
				<template slot-scope="{ row }">
					<!-- <span>{{row.head}}</span> -->
					<el-image :src="row.head" style="width:100px;height:100px"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="head" label="是否会员">
				<template slot-scope="{ row }">
					<span v-if="row.hasMember">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="contact" label="联系电话"> </el-table-column>
			<el-table-column prop="expiration" label="会员日期"> </el-table-column>
			<!-- <el-table-column prop="record" label="借书记录">
        <template slot-scope="{row}">
          <span v-for="item in row.recordList" :key="item.id">{{item.name}}；</span>
        </template>
      </el-table-column> -->
			<el-table-column prop="classGradeName" label="所属班级" />
			<el-table-column prop="kindergartenName" label="所属幼儿园">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="{ row }">
					<span class="handle" @click="update(row)">修改</span>
					<span class="handle" @click="deleteDownload(row)">删除</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background layout="total, sizes, prev, pager, next" :total="total"
			:current-page.sync="searchForm.pageNum" :page-size="searchForm.pageSize" @size-change="sizeChange"
			@current-change="currentChange">
		</el-pagination>

		<el-dialog title="操作" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="form" label-width="100px" ref="form">
				<el-form-item label="会员名称：" prop="name">
					<el-input v-model="form.name" placeholder="请输入会员名称"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" prop="contact">
					<el-input v-model="form.contact" placeholder="请输入联系电话"></el-input>
				</el-form-item>

				<!-- <el-form-item label="入会日期：" prop="admission">
          <el-date-picker
            v-model="form.admission"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入会日期："
          >
          </el-date-picker>
        </el-form-item> -->
				<el-form-item label="所属幼儿园：">
					<el-select v-model="form.kindergarten" placeholder="请选择所属幼儿园" clearable @change="selectPark">
						<el-option v-for="item in kindergartenList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属班级：">
					<el-select v-model="form.clBum" placeholder="请输入所属班级" clearable no-data-text="请先选择所属幼儿园">
						<el-option v-for="item in classList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="所属班级：" prop="clbum">
          <el-input
            v-model="form.clbum"
            placeholder="请输入所属班级"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属幼儿园：" prop="kindergarten">
          <el-input
            v-model="form.kindergarten"
            placeholder="请输入所属幼儿园"
          ></el-input>
        </el-form-item> -->
				<el-form-item label="会员头像：" prop="hard">
					<el-upload ref="cover" :limit="1" :file-list="cover" :action="action" :headers="headers"
						list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
						:on-success="handleSuccess" :before-upload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sendMailAndSms">确 定</el-button>
			</div>
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
	} from "@/api/member";
	import {
		setStorage,
		getStorage
	} from "@/utils/auth";
	import {
		ConservatorList
	} from "@/api/person";
	import {
		kindergartenList,
		classList
	} from "@/api/select"

	export default {
		components: {},
		data() {
			return {
				searchForm: {
					name: "",
					contact: "",
					owning: "",
					classId: "",
					kindergarten: "",
					pageNum: 1,
					pageSize: 10,
				},
				//表格数据
				tableData: [],
				total: 0,
				dialogFormVisible: false,
				form: {
					name: "",
					age: "",
					gender: "",
					birth: "",
					contact: "",
					owning: "",
					admission: "",
					record: "",
					head: "",
					kindergarten: "",
					clbum: "",
				},
				multipleSelection: [],
				dialogImageUrl: "",
				dialogVisible: false,
				action: process.env.VUE_APP_BASE_API + "/sys/common/upload",
				textImage: [],
				attachment: [],
				headers: {
					Authorization: getStorage("token"),
				},
				conservatorList: [],
				cover: [],
				row: {},
				kindergartenList: [],
				classList: [],
				origin: process.env.VUE_APP_HOST_URL
			};
		},
		created() {
			this.getKindergartenList()
		},
		mounted() {
			this.getQueryByPage();
			this.getConservator();
		},
		computed: {},
		methods: {
			selectPark(e) {
				this.getClassList(e)
				this.searchForm.classId = ''
				this.form.classId = ''
				console.log(e)
			},
			//查询幼儿园
			getKindergartenList() {
				kindergartenList().then(res => {
					this.kindergartenList = res.data
				})
			},
			//查询班级
			getClassList(kindergartenId, id) {
				classList({
					kindergartenId
				}).then(res => {
					this.classList = res.data
				})
			},
			getConservatorName(id) {
				let str = "";
				this.conservatorList.forEach((item) => {
					if (item.id == id) {
						str = item.name;
					}
				});
				return str;
			},
			getConservator() {
				ConservatorList({
					pageNum: 1,
					pageSize: 999
				}).then((res) => {
					this.conservatorList = res.ConserList.list;
				});
			},
			beforeAvatarUpload(file) {
				let arr = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
				if (!arr.includes(file.type)) {
					this.$message.error("只能上传图片格式!");
				}
				return arr.includes(file.type);
			},
			handleSuccess(res) {
				this.form.head = this.origin+res.fileName;
				// if (res.code === 200) {
				//   this.form.head = res.file
				//   // this.textImage.push(res.data);
				// } else {
				//   this.$message.error(res.msg);
				// }
			},
			handleRemove(file, fileList) {},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = URL.createObjectURL(file.raw);
				this.dialogVisible = true;
			},
			update(row) {
				this.id = row.id;
				row.owning = Number(row.owning);
				this.form = Object.assign({}, row);
				this.row = Object.assign({}, row);
				this.getClassList(this.form.kindergarten)
				this.dialogFormVisible = true;
				this.cover = [];
				this.cover.push({
					url: row.head
				});
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
							this.$message({
								type: "success",
								message: "删除成功!",
							});
							this.getQueryByPage();
							if (res.code === 200) {}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			//批量发送
			batchSend() {
				this.dialogFormVisible = true;
			},
			//邮件发送
			sendMailAndSms() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						let obj = JSON.parse(JSON.stringify(this.form));
						// if(obj.recordList.length > 0){
						//   obj.recordList = obj.recordList.map(item => JSON.stringify(item))
						// }
						if (this.id) {
							update({
								...obj,
								id: this.id,
								em_did: this.row.owning,
							}).then((res) => {
								this.$message.success("修改成功");
								this.dialogFormVisible = false;
								this.getQueryByPage();
							});
						} else {
							append(obj).then((res) => {
								this.$message.success("添加成功");
								this.dialogFormVisible = false;
								this.getQueryByPage();
							});
						}
					}
				});
			},
			send() {
				for (let key in this.form) {
					if (key === 'record') {
						this.form[key] = [];
					} else {
						this.form[key] = "";
					}

				}
				this.id = "";
				this.cover = [];
				this.dialogFormVisible = true;
			},
			sizeChange(val) {
				this.searchForm.pageSize = val;
				this.searchForm.pageNum = 1;
				this.getQueryByPage();
			},
			currentChange(val) {
				this.searchForm.pageNum = val;
				this.getQueryByPage();
			},
			getQueryByPage() {
				queryByPage(this.searchForm).then((res) => {
					this.tableData = res.data.records;
					this.tableData.forEach(item => {
						if (item.kindergarten) {
							this.kindergartenList.forEach(el => {
								if (item.kindergarten == el.id) {
									item.kindergartenName = el.name
								}
							})
						}

					})
					// this.tableData.forEach(item=>{
					//   item.recordList = item.recordList.map(el=>{
					//     return JSON.parse(el)
					//     // item.bookList.push(el)
					//     // console.log(el,'---------el')
					//   })

					// })
					console.log(this.tableData, '-----')
					// this.tableData.forEach(item=>{
					//   item.person = JSON.parse(item.person)
					// })
					this.total = res.data.total;
				});
			},
			onSubmit() {
				this.getQueryByPage();
				console.log("submit!");
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