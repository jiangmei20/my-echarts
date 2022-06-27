/**
 * @description :可拖拽图表布局功能
 * @author：蒋梅
 * @email :
 * @creatTime : 2022/01/18
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import styles from './index.less';
const CheckboxGroup = (props) => {
  const [plainOptions, setPlainOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (props?.plainOptions?.length > 0) {
      setPlainOptions(props.plainOptions);
    }
  }, [props?.plainOptions]);

  useEffect(() => {
    if (props?.checkedList?.length > 0) {
      let list = props?.checkedList;
      let plainOptions = props?.plainOptions;
      setCheckedList(list);
      setIndeterminate(!!list.length && list.length < plainOptions.length);
      setCheckAll(plainOptions?.length === list?.length);
    }
  }, [props?.checkedList]);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    props?.onChangeCheckbox && props?.onChangeCheckbox(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? plainOptions.map((item) => item.value) : [],
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    props?.onChangeCheckbox &&
      props?.onChangeCheckbox(
        e.target.checked ? plainOptions.map((item) => item.value) : [],
      );
  };

  return (
    <>
      <div className={styles.checkAllStyle}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      </div>

      {props?.customRender ? (
        <Checkbox.Group value={checkedList} onChange={onChange}>
          {props.customRender()}
        </Checkbox.Group>
      ) : (
        <Checkbox.Group value={checkedList} onChange={onChange}>
          {plainOptions.map((item) => (
            <Checkbox value={item.value}>
              <span className={styles.checkboxLabel}>{item.label}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      )}
    </>
  );
};
export default CheckboxGroup;
