export const getPlaceholder = (props: any) => {
  const { label, type } = props;
  if (!label) return ''
  if (type === 'Input') return `请输入${label}`
  if (type === 'Select') return `请选择${label}`
}
