
import { Avatar} from "antd"
import styles from "./MemberColumnItem.less";
import _ from "lodash";
import Truncate from 'react-truncate';
import { parseImgUrl } from "@/utils/parse";


const MemberColumnItem = (props: any) => {
     
  const { dataItem } = props;
  //RENDER UI 
  return <div className={styles.component}>
        <Avatar size={44} className={styles.avatar} src={parseImgUrl(dataItem?.avatar) } />
        <div className={styles.contentBlock}>
      <h4 className={styles.fullName}><Truncate >{ dataItem?.fullName}</Truncate></h4>
          <span className={styles.roleName}>{ dataItem?.roleName}</span>
   </div>
    </div>
};

export default MemberColumnItem;
