import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import { ElMessage, ElMessageBox } from 'element-plus'

const messageBox = {
    confirm: ElMessageBox.confirm,
    alert: ElMessageBox.alert,
    prompt: ElMessageBox.prompt,
    msgbox: ElMessageBox.msgbox,
    message: ElMessage,
    notify: ElMessage,
    delete: (callback: Function) => {
        ElMessageBox.confirm("是否确定删除！", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",

        }).then(() => {
            callback && callback( true );
        }).catch(() => {
            callback && callback( false);
        })
    }
};

export default messageBox;