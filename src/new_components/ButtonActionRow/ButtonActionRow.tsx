
import classNames from "classnames";
import styles from "./ButtonActionRow.less"
import {icActive,icDelete,icDisable,icEdit} from "@/assets/icons/table"
import { translate } from "@/utils";
interface IButtonActionRowProps   {
  className?: any,
  onClick?:()=>void,
  type: "EDIT" | "VIEW" | "DELETE" | "ACTIVE" | "INACTIVE" |"VIEW_EDIT",
  
}
const ButtonActionRow = (props: IButtonActionRowProps) => {
  const { className,onClick=()=>{},...rest } = props;
   
  const { type } = props;
  let icon: any = "";
  let text: any = "";
  switch(type){
    case "VIEW_EDIT":
    case "EDIT":
      icon = icEdit;
      text= translate("View & edit")
      break;
    case "VIEW":
      icon = icEdit;
      text= translate("View")

      break;
    case "DELETE":
      icon = icDelete;
      text= translate("Delete")

      break;
    case "ACTIVE":
      icon = icActive;
      text = translate("Active");
      break;

    case "INACTIVE":
      icon = icDisable;
      text= translate("Inactive")
      break;
  }




  return <div onClick={onClick} className={classNames(styles.component, {
    [styles.delete]: type === "DELETE",
    [styles.inactive]: type === "INACTIVE"
   })}>
     <img src={icon} />
     <span>{ text}</span>
   </div> 

}

export default ButtonActionRow