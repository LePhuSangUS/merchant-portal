import React from "react";
import { PageLoading as Comp } from '@ant-design/pro-layout';
import styles from "./index.less";

interface LoadingProps {
  active?: boolean
}

const PageLoading: React.FC<LoadingProps> = ({ active }) => {
  return (
    active ? (
      <div className={styles.pageLoading}>
        <div className={styles.maskLayer}>
          <Comp className={styles.antSpin} />
        </div>
      </div>
    ) : null
  )
}

export default PageLoading;
