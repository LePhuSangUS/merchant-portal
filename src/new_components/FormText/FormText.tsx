import styles from "./FormText.less"
import  {
  ProFormText,
  
} from '@ant-design/pro-form/';

 const CustomFormText =(props:any)=>{
    const { ...rest } = props;
   return<div className={styles.component}><ProFormText  {...rest}></ProFormText></div> 

}

export default CustomFormText