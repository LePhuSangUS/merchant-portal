import React, { useState, useEffect } from 'react';
import { parseValue } from '@/utils/parse';
import { Tag, Space } from 'antd';
import _ from 'lodash';

interface Props {
  text?: string | undefined,
  color?: string | undefined,
  icon?: any | undefined,
  value?: any | undefined,
  options?: any[] | undefined,
  children?: any | undefined,
  visible?: boolean,
  spaceSize?: 'small' | 'middle' | 'large' | number | undefined,
  spaceWrap?: boolean
}

const Status: React.FC<Props> = (
  {
    text,
    color,
    icon,
    value,
    options,
    children,
    visible = true,
    spaceSize = 4,
    spaceWrap = true
  }
) => {
  const [val, setValue] = useState<any>(value || '');
  const [opts, setOptions] = useState<any[]>(options?.length ? options : []);
  const [txt, setText] = useState<any>(children || text || '');
  const [clr, setColor] = useState<any>(color || '');
  const [icn, setIcon] = useState<any>(icon || '');

  useEffect(() => {
    setValue(value || '');
  }, [value]);

  useEffect(() => {
    setOptions(options || []);
  }, [options]);

  useEffect(() => {
    setText(children || text || '');
  }, [text, children]);

  useEffect(() => {
    setColor(color || '');
  }, [color]);

  useEffect(() => {
    setIcon(icon || '');
  }, [icon]);

  useEffect(() => {
    const item = (
      opts?.length
        ? opts.find(i => i.value === val)
        : null
    );
    setText(item?.label || value || children || text || '');
    setColor(item?.color || color || '');
    setIcon(item?.icon || icon || '');
  }, [val, opts]);

  return (
    _.isArray(txt)
    && txt?.length ? (
      <Space wrap={spaceWrap} size={spaceSize} hidden={!visible}>
        {
          txt.map((t: any) => (
            <Tag key={t} color={clr} icon={icn}>
              {parseValue(t)}
            </Tag>
          ))
        }
      </Space>
    ) : (
      <Tag color={clr} icon={icn} visible={visible}>
        {parseValue(txt)}
      </Tag>
    )
  )
};

export { Status };
