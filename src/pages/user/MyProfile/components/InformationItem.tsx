
import { Card, Button } from "@/new_components";
import { Avatar, Empty, Skeleton } from "antd"
import styles from "./InformationItem.less";
import { parseImgUrl } from '@/utils/parse';
import { translate } from "@/utils";
import _ from "lodash";
import {IInformationItem} from "../types"

const InformationItem = (props: IInformationItem) => {
     
  const { title,dataList } = props;
  //=================================RENDER UI =======================
  return <div className={styles.component}>
    <h1 className={styles.title}>{ title}</h1>

    {dataList?.map(item => {
      return <div key={item?.id} className={styles.item}>
        <img className={styles.icon} src={item?.icon} />
        <div className={styles.contentBlock}>
          <h4 className={styles.label}>{ item?.label}</h4>
          <p className={styles.content}>{ item?.content}</p>
        </div>
     </div>
   })}
    </div>
};

export default InformationItem;
