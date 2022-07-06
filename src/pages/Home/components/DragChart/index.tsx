/**
 * @description :可拖拽图表布局功能
 * @author：蒋梅
 * @email :
 * @creatTime : 2022/01/18
 */
import React, {useState, useRef, useEffect} from 'react';
// @ts-ignore
import {WidthProvider, Responsive} from 'react-grid-layout';
import * as echarts from 'echarts';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';
import {List, Checkbox, Image} from 'antd';
// @ts-ignore
import CheckboxGroup from './components/CheckboxGroup';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export interface CustomContent {
  layouts: any,
  widgets: []
}

interface DragChartProp {
  /** 所有部件的列表 */
  showContentList: any[],
  /** 自定义布局的数据 */
  customContent: CustomContent,
  /** 是否显示部件选择内容 */
  checkWidgetsShow?: boolean,
  /** 监听布局变化 */
  onChangeLayout: (value: any) => any,
  columns?: number,
  /** 行高，图表的高=拖动的行高*h(多少份高) */
  rowHeight?: number,
}

const DragChart = (props: DragChartProp) => {
  let defaultLayout = {
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 0},
    rowHeight: props?.rowHeight || 90,
  };
  const {columns = 12, showContentList, customContent, checkWidgetsShow} =
  props || {};

  const [widgets, setWidgets] = useState<any[]>([]);
  const [layouts, setLayouts] = useState({});
  //图表选择所以列表
  const [checkOptions, setCheckOptions] = useState<any[]>([]);
  //选择中图表数据
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const dragLayoutFunRef = useRef();

  useEffect(() => {
    if (showContentList?.length > 0) {
      let options = showContentList.map((item) => {
        return {
          label: item.label,
          value: item.value,
          imgName: item?.imgName,
        };
      });
      setCheckOptions(options);
    }
  }, [showContentList]);

  useEffect(() => {
    if (customContent) {
      customWidgetsData(customContent);
    } else {
      initWidgetsData(showContentList);
    }
  }, [customContent]);

  useEffect(() => {
    if (widgets?.length > 0) {
      props?.onChangeLayout && props?.onChangeLayout({widgets, layouts});
    }
  }, [widgets, layouts]);

  /**
   * 初始化默认的模块
   * @param list 展示数据列表
   */
  const initWidgetsData = (list: any[]) => {
    let initWidgets: any = [];
    list.length > 0 &&
    list.map((item, i) => {
      // 高的以前算法
      let x = (i * 4) % (columns || 12);
      let addItem = {
        x: x,
        y: Infinity,
        w: 4,
        h: 3,
        i: new Date().getTime().toString() + '@' + String(i),
      };
      initWidgets = initWidgets.concat({
        ...item,
        ...addItem,
      });
    });
    getCheckedList(showContentList);
    // 初始化布局
    let initLayout = {lg: [{w: 4, h: 3, x: 0, y: 0, i: ''}]};
    setLayouts(initLayout);
    setWidgets(initWidgets);
  };

  /**
   * 自定义的小部件数据
   * @param customCon:{layout:{},widgets:[]}
   */
  const customWidgetsData = (customCon: CustomContent) => {
    // 自定义布局
    if (customCon?.layouts?.lg) {
      setLayouts(customCon.layouts);
    } else {
      let initLayout = {lg: [{w: 4, h: 3, x: 0, y: 0, i: ''}]};
      setLayouts(initLayout);
    }
    // 自定义布局数据
    if (customCon?.widgets?.length > 0) {
      let customWidgets = customCon.widgets.map((item: any) => {
        let findItem = showContentList.find((val) => val.id === item?.id);
        if (!item?.y) {
          item = {...item, y: Infinity, ...findItem};
        }
        return item;
      });
      getCheckedList(customWidgets);
      setWidgets(customWidgets);
    } else {
      initWidgetsData(showContentList);
    }
  };

  /**
   * 获取选择中列表数据
   * @param list 图表数据
   */
  const getCheckedList = (list: any[]) => {
    if (list?.length > 0) {
      let checkedData = list.map((item) => {
        return item.value;
      });
      setCheckedList(checkedData);
    }
  };

  /**
   * 增加图表
   * @param type
   */
  const addChart = (type: string) => {
    let addItem = showContentList.filter((item) => item.value === type);
    let needWidgets = [...widgets];
    needWidgets.push(addItem[0]);
    initWidgetsData(needWidgets);
  };

  /**
   * 移除图表
   * @param chartVal
   */
  const onRemoveItem = (chartVal: string) => {
    let needWidgets = widgets.filter((item) => item.value !== chartVal);
    initWidgetsData(needWidgets);
  };
  /**
   * 监听选择列表的变化
   * @param checkedData 选择的部件
   */
  const onChangeCheckbox = (checkedData: string[]) => {
    if (checkedData.length > checkedList.length) {
      let newData = checkedData.filter((item) => checkedList.indexOf(item) < 0);
      if (newData?.length === showContentList?.length) {
        initWidgetsData(showContentList);
      } else {
        newData?.length > 0 &&
        newData.map((item) => {
          addChart(item); //增加
        });
      }
    } else {
      let newData = checkedList.filter((item) => checkedData.indexOf(item) < 0);
      if (checkedData?.length === 0) {
        setWidgets([]);
      } else {
        newData?.length > 0 &&
        newData.map((item) => {
          onRemoveItem(item); //移除block
        });
      }
    }
    setCheckedList(checkedData);
  };

  /**
   * 监听布局变化函数
   * @param layout
   * @param layouts
   */
  const onLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  /**
   * 改变图的布局(监听尺寸大小变化去改变图形大小)
   * @param a
   * @param b
   */
  const onResizeStop = (a: any[], b: any) => {
    //高的最小值设置
    a.map((item: any) => {
      if (item.i === b.i) {
        item.h < 2 ? (item.h = 2) : item.h;
      }
    });
    widgets.map((item) => {
      let id = item.value;
      if (item.i == b.i) {
        let chartDom = document.getElementById(id);
        if (chartDom) {
          let chartObj = echarts.getInstanceByDom(chartDom);
          chartObj?.resize();
        }
      }
    });
  };

  /**
   * 获取选择的模块的列表
   */
  const getCheckWidgetsDom = () => {
    return (
      <div className={styles.checkWidgetsCon}>
        <CheckboxGroup
          onChangeCheckbox={onChangeCheckbox}
          plainOptions={checkOptions || []}
          checkedList={checkedList || []}
          customRender={() => (
            <List
              grid={{
                gutter: 2,
                column: checkOptions?.length < 3 ? checkOptions?.length : 3,
              }}
              dataSource={checkOptions || []}
              renderItem={(item) => (
                <Checkbox value={item.value}>
                  <span className={styles.checkboxLabel}>{item.label}</span>
                </Checkbox>
                // <List.Item>
                //   {item?.imgName ? (
                //     <Checkbox value={item.value}>
                //       <div>{item.label}</div>
                //       <div>
                //         <Image
                //           width={'100%'}
                //           height={'20vh'}
                //           src={require('../../statics/images/' + item.imgName)}
                //           preview={false}
                //         />
                //       </div>
                //     </Checkbox>
                //   ) : (
                //     <Checkbox value={item.value}>
                //       <span className={styles.checkboxLabel}>{item.label}</span>
                //     </Checkbox>
                //   )}
                // </List.Item>
              )}
            />
          )}
        />
      </div>
    );
  };

  /**
   * 获取自定义布局Dom
   */
  const generateDOM = () => {
    return widgets.map((item) => {
      return (
        <div key={item.i} data-grid={item} className={styles.chartItem}>
          {item?.render && item?.render()}
        </div>
      );
    });
  };

  return (
    <div className={styles.dragChart}>
      {/*{checkWidgetsShow && checkOptions?.length > 0 && getCheckWidgetsDom()}*/}
      <ResponsiveReactGridLayout
        className="layout"
        {...defaultLayout}
        layouts={layouts}
        onLayoutChange={(layout: any, layouts: any) => onLayoutChange(layout, layouts)}
        onResizeStop={onResizeStop}
        ref={dragLayoutFunRef}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};
export default DragChart;
