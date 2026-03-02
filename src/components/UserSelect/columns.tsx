type ColumnType = {
  title: string;
  subTitle: string;
  dataIndex: string;
  width: number;
  align: string;
};

export const userSelectConfigColumns: ColumnType[] = [
  { title: 'base.user.list.table.column.user_code', subTitle: '用户编码', dataIndex: 'user_code', width: 120, align: 'center' },
  { title: 'base.user.list.table.column.user_name', subTitle: '用户姓名', dataIndex: 'user_name', width: 120, align: 'center' },
  { title: 'base.user.list.table.column.id_no', subTitle: '身份证号', dataIndex: 'id_no', width: 180, align: 'center' },
  { title: 'base.user.list.table.column.group_name', subTitle: '组织/角色', dataIndex: 'group_name', width: 140, align: 'center' },
  { title: 'base.user.list.table.column.tel_num', subTitle: '电话', dataIndex: 'tel_num', width: 130, align: 'center' },
  { title: 'base.user.list.table.column.email', subTitle: '邮箱', dataIndex: 'email', width: 180, align: 'center' },
  { title: 'base.user.list.table.column.sex', subTitle: '性别', dataIndex: 'sex', width: 80, align: 'center' },
  { title: 'base.user.list.table.column.last_login_ts_str', subTitle: '最后登录时间', dataIndex: 'last_login_ts_str', width: 160, align: 'center' },
  { title: 'base.user.list.table.column.valid', subTitle: '有效', dataIndex: 'valid', width: 80, align: 'center' },
  { title: 'base.user.list.table.column.remark', subTitle: '备注', dataIndex: 'remark', width: 160, align: 'center' },
];
