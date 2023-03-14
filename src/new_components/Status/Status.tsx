import React, { Fragment, useEffect } from 'react';
import { parseValue } from '@/utils/parse';
import styles from "./Status.less";
import _ from 'lodash';

interface IOption{
  value: any,
  label: {
    vi: string,
    en: string,
  },
  style?: any
}
interface IStatusProps {
  value?: any | undefined,
  options?: IOption[],
  type?:"text"|"status",

}
const CustomStatus =(props:IStatusProps)=>{
  const { value, options = [],type="status", ...rest } = props;
  const option: IOption | undefined = _.find(options, { value });
  const label:any = parseValue(option?.label);
  const style:any = option?.style;


  return (type == "text") ?<Fragment>{label}</Fragment>:<div style={{
    color: style?.color,
    background:style?.background,
  }} className={styles.component}>{ label}</div> 

}

export default CustomStatus