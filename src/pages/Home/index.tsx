/**
 * @description： 首页
 * @author： 蒋梅
 * @createTime： 2022-06-22
 */
import React, {useState} from "react";
import styles from './index.less';
import MigrationMap from "@/pages/Home/components/MigrationMap";
import DragChart, {CustomContent} from "@/pages/Home/components/DragChart";
import BasicRosePie from "@/pages/Home/components/BasicRosePie";
import HomeCountItemWrap from "@/pages/Home/components/HomeCountItemWrap";
import BasicLoopPie from "./components/BasicLoopPie";

const Home = () => {
  const showContentList = [
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
    },{
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
    }
  ]
  /**
   * 监听布局变化
   * @param customLayout
   */
  const onChangeLayout = (customLayout: CustomContent) => {
    console.log('监听布局变化', customLayout)
  }
  return (
    <div className={styles.home}>
      <DragChart
        showContentList={showContentList}
        customContent={{layouts: {}, widgets: []}}
        onChangeLayout={onChangeLayout}
      />
    </div>
  )
}
export default Home;
