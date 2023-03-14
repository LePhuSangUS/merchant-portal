
import { Button, DatePicker } from "antd";
import classNames from "classnames";
import styles from "./DateRangePicker.less";
import type { DatePickerProps } from "antd/es/date-picker";
import {icCalendar} from "@/assets/icons/table"
import { translate } from "@/utils";
const { RangePicker } = DatePicker;

type IDatePickerProps =  DatePickerProps & {
  className?:any,
}
 const DateRangePicker =(props:IDatePickerProps)=>{
   const { className,...rest } = props;
   return <div className={styles.component}><RangePicker
     format={"DD/MM/YYYY"}
     placeholder={[translate("From date"),translate("To date")] as any}
     suffixIcon={<img className="range-picker-icon" src={icCalendar} alt="icon" />}
     dropdownClassName=""
     popupClassName=""
     className={classNames(className)}
     {...rest}></RangePicker>
   </div> 

}

export default DateRangePicker