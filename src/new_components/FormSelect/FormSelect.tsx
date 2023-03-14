import classNames from 'classnames';
import styles from './FormSelect.less';
import { ProFormSelectProps } from "@ant-design/pro-form/lib/components/Select";
import { icArrowUp } from '@/assets/icons/table';
import { ProFormSelect } from '@ant-design/pro-form';
type IFormSelectProps = ProFormSelectProps & {
  className?: any;
};
const FormSelect = (props: IFormSelectProps) => {
  const { className,fieldProps, ...rest } = props;
  return (
    <div className={styles.component}>
      <ProFormSelect
        
        fieldProps={{
          size:"large",
          suffixIcon: <img src={icArrowUp} alt="icon" />,
          ...fieldProps
        }}
        className={classNames(className)}
        {...rest}
      ></ProFormSelect>
    </div>
  );
};

export default FormSelect;
