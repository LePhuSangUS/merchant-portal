
import { Card, CardProps } from "antd";
import classNames from "classnames";
import styles from "./Card.less";
import { ReactNode } from "react";
interface IPageProps extends CardProps  {
  children: any,
  className?: any,
  title?: ReactNode | string,
}
 const Page =(props:IPageProps)=>{
    const { children,title,className,...rest } = props;
   return <Card bordered={false} className={classNames(className, styles.component)} {...rest}>
     {title && <div className={styles.title}>{ title}</div>}
     {children}
   </Card>

}

export default Page