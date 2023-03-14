import classnames from "classnames";
import React, { Component } from "react";
import styles from "./Page.less";
import {Spinner} from "@/new_components"

interface IPageProps {
  loading?: boolean;
  inner?: boolean;
  className?: string;
  children:any,
}
 const Page =(props:IPageProps)=>{
    const { className, children, loading = false, inner = false } = props;
    return (
      <div
        className={classnames(styles.component,className, {
          [styles.contentInner]: inner,
        })}
      >
        {loading ? <Spinner spinning={true} /> : ""}
        {children}
      </div>
    );

}

export default Page