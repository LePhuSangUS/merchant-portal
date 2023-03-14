
import { Button, ButtonProps } from "antd";
import classNames from "classnames";
import styles from "./Button.less"
interface IButtonProps extends ButtonProps  {
  className?:any,
}
 const CustomButton =(props:IButtonProps)=>{
   const { className, size ="large",...rest } = props;
   return<div className={styles.component}><Button size={size}  className={classNames(className)} {...rest}></Button></div> 

}

export default CustomButton