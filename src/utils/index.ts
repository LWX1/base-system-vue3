import { dayjs } from "element-plus";

// 格式化时间
export const formatTime = (time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time) return '';
    return dayjs(time).format(format);
}

// 获取key对应的value
export const getKeyValue = (dict: Array<{
    label: string,
    value: string | number
}>, value: string) => {
    const item = dict.find((item: any) => item.value === value);
    return item ? item.label : '';
}