const FormItemCom:any = {};
const getComponent = () => {
    const modules = import.meta.glob('src/components/FormItems/*.vue')
    Object.keys(modules).forEach((key) => {
        const name = key.replace(/.*\/FormItems\/(.*)\.\w+$/, '$1');
        FormItemCom[name] = modules[key];
    });
}

getComponent();

export default FormItemCom;
