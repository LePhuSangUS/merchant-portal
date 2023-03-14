//Lib
//Component
import React from "react";
import styles from "./Spinner.less";
import ReactLoading from "react-loading"
//Styled Component
//Img
//Const
const Spinner = (props: any) => {
  return <div className={styles.component}>
        <ReactLoading type={'spinningBubbles'} color="#764cf0" />
  </div>
};

export default Spinner;