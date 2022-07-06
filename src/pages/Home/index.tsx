/**
 * @description： 首页
 * @author： 蒋梅
 * @createTime： 2022-06-22
 */
import React, {useEffect, useRef, useState} from "react";
import styles from './index.less';
import MigrationMap from "@/pages/Home/components/MigrationMap";
import DragChart, {CustomContent} from "@/pages/Home/components/DragChart";
import BasicRosePie from "@/pages/Home/components/BasicRosePie";
import HomeCountItemWrap from "@/pages/Home/components/HomeCountItemWrap";
import BasicLoopPie from "./components/BasicLoopPie";
import BasicFilletBar from "@/pages/Home/components/BasicFilletBar";
import DrillDownMap from "@/pages/Home/components/DrillDownMap";
import MultipleLine from "@/pages/Home/components/MultipleLine";
import AreaLine from "@/pages/Home/components/AreaLine";
import VerticalGradientBar from "@/pages/Home/components/VerticalGradientBar";

const Home = () => {
  const homeRef:any = useRef();
  const [rowHeight,setRowHeight]=useState(90);
  const showContentList = [
    {
      id: 'drillDownMap',
      label: '点击下钻地图',
      value: 'drillDownMap',
      render: () => (
        <HomeCountItemWrap title={'点击下钻地图'}>
          {/*<DrillDownMap*/}
          {/*  id={'drillDownMap'}*/}
          {/*/>*/}
        </HomeCountItemWrap>
      ),
    },
    {
      id: 'myMigrationMap',
      label: '迁徙图',
      value: 'myMigrationMap',
      render: () => (
        <HomeCountItemWrap title={'迁徙图'}>
          <MigrationMap
            id={'myMigrationMap'}
            data={{
              citys: [
                {name: '北京', count: 2},
                {name: '贵州', count: 1},
                {name: '云南', count: 1},
              ],
              moveLines: [
                {fromName: '贵州', toName: '北京'},
                {fromName: '云南', toName: '北京'},
              ]
            }}
          />
        </HomeCountItemWrap>
      ),
    }, {
      id: 'basicRosePie',
      label: '玫瑰饼图',
      value: 'basicRosePie',
      render: () => (
        <HomeCountItemWrap title={'玫瑰饼图'}>
          <BasicRosePie
            id={'basicRosePie'}
            data={{
              data: [{
                value: 3108,
                name: '18岁以下'
              }, {
                value: 2348,
                name: '19~25岁'
              }, {
                value: 1358,
                name: '26~30岁'
              }, {
                value: 1548,
                name: '31~40岁'
              }, {
                value: 1548,
                name: '41岁以上'
              }, {
                value: 3350,
                name: '年龄不详'
              },]
            }}
          />
        </HomeCountItemWrap>
      )
    }, {
      id: 'basicLoopPie',
      label: '环饼图',
      value: 'basicLoopPie',
      render: () => (
        <HomeCountItemWrap title={'环饼图'}>
          <BasicLoopPie
            id={'basicLoopPie'}
            data={{
              data: [{
                value: 3108,
                name: '18岁以下'
              }, {
                value: 2348,
                name: '19~25岁'
              }, {
                value: 1358,
                name: '26~30岁'
              }, {
                value: 1548,
                name: '31~40岁'
              }, {
                value: 1548,
                name: '41岁以上'
              }, {
                value: 3350,
                name: '年龄不详'
              },]
            }}
          />
        </HomeCountItemWrap>
      )
    }, {
      id: 'basicFilletBar',
      label: '圆角条形图',
      value: 'basicFilletBar',
      render: () => (
        <HomeCountItemWrap title={'圆角条形图'}>
          <BasicFilletBar
            id={'basicFilletBar'}
            data={{
              x: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              data: [332, 301, 334, 390, 330, 320, 495, 256, 405, 450, 330, 320]
            }}
          />
        </HomeCountItemWrap>
      )
    }, {
      id: 'multipleLine',
      label: '多条折线组件',
      value: 'multipleLine',
      render: () => (
        <HomeCountItemWrap title={'多条折线组件'}>
          <MultipleLine
            id={'multipleLine'}
            data={{
              legend:['数据1','数据2'],
              x: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              data: [{
                name:'数据1',value:[332, 301, 334, 390, 330, 320, 495, 256, 405, 450, 330, 320],
              },{
                name:'数据2',value:[32, 301, 134, 590, 130, 420, 495, 256, 405, 350, 230, 120],
              }
              ]
            }}
          />
        </HomeCountItemWrap>
      )
    }, {
      id: 'areaLine',
      label: '多条折线组件',
      value: 'areaLine',
      render: () => (
        <HomeCountItemWrap title={'多条折线组件'}>
          <AreaLine
            id={'areaLine'}
            data={{
              x: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              data: [332, 301, 334, 390, 330, 320, 495, 256, 405, 450, 330, 320]
            }}
          />
        </HomeCountItemWrap>
      )
    },{
      id: 'verticalGradientBar',
      label: '垂直渐变条形图',
      value: 'verticalGradientBar',
      render: () => (
        <HomeCountItemWrap title={'垂直渐变条形图'}>
          <VerticalGradientBar
            id={'verticalGradientBar'}
            data={{
              x: ["1月", "2月", "3月", "4月", "5月"],
              data: [332, 301, 334, 390, 330],
              color:['#FAB24100','#FAB241']
            }}
          />
        </HomeCountItemWrap>
      )
    }
  ]
  useEffect(()=>{
    if(homeRef?.current?.clientHeight){
      setRowHeight(Math.floor(homeRef?.current?.clientHeight/10))
    }
  },[homeRef?.current?.clientHeight])
  /**
   * 监听布局变化
   * @param customLayout
   */
  const onChangeLayout = (customLayout: CustomContent) => {
    console.log('监听布局变化', customLayout)
  }
  return (
    <div className={styles.home} ref={homeRef}>
      <DragChart
        showContentList={showContentList}
        customContent={{layouts: {}, widgets: []}}
        onChangeLayout={onChangeLayout}
        rowHeight={rowHeight}
      />
    </div>
  )
}
export default Home;
