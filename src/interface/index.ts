

// 定义接口返回值类型
export interface IResponse<T> {
    code: number;
    data: T;
    message: string;
    timestamp: string;
}


// 定义接口菜单
export interface IMenu{
	createTime?: string;
	id?: number;
	name: string;
	parentId?: number;
	updateTime?: string;
	url?: string;
	children?: Array<IMenu>;
    component?: any;
    redirect?: string;
}

// 定义对象
export interface IObject<T> {
    [key: string]: T;
}

// 定义aside数据
export interface IAside {
    name: string;
    path: string;
    children?: Array<IAside>;
}

// 定义表格的columns
export interface ITableColumns {
    title: string;
    dataIndex: string;
    key?: string;
    width?: number;
    render?: boolean;
}

// 树节点
export interface ITreeNode {
    id: number;
    label: string;
    value: number;
    children?: Array<ITreeNode>;
    parentId?: number;
}

// 定义表单
export interface IForm {
    formProps: object,
    dataList: Array<object>,
    formItemProps: object,
}

// 定义表单项
export interface IFormItem {
    label: string;
    name: string;
    type: string;
    value?: string;
    placeholder?: string;
    rules?: Array<object>;
    options?: Array<object>;
    disabled?: boolean;
    width?: string | number;
}

// 定义分页
export interface IPagination {
    pageNum: number;
    pageSize: number;
    total: number;
    onPageSizeChange?: Function;
    onChange?: Function;
}

// 定义按钮
export interface IButton {
    type?: string;
    name: string;
    onClick: Function;
}
