/**
 * @description :玫瑰饼图
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/04/15
 */
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as echarts from 'echarts';

interface PieData {
  /** 数值 */
  value: number;
  /** 对应的数值的名称 */
  name: string;
}

interface RosePieData {
  name?: string;
  /** 饼图数据 */
  data: PieData[];
}

interface BasicRosePieProps {
  /** echarts中图形id */
  id: string;
  /** 条形图的数据 */
  data: RosePieData;
  /** 样式的类名 */
  className?: string;
  /** 字体大小 */
  echartsFontSize?: number;
}

const BasicRosePie = (props: BasicRosePieProps) => {
  const { id, data } = props;
  const basicRosePieRef = useRef<any>(0);
  const currentIndexRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (basicRosePieRef?.current) {
        clearInterval(basicRosePieRef.current);
        basicRosePieRef.current = undefined;
      }
    };
  },[]);

  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const pieChart = echarts?.init(idElement);
      pieChart?.setOption(getOption());
      // 定时器处理
      if (basicRosePieRef?.current) {
        clearHighlight(pieChart);
      }
      // 设置高亮
      pieChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0,
      });
      basicRosePieRef.current = setInterval(function() {
        timerHighlight(pieChart);
      }, 3000);
      pieChart.on('mouseover', (params: any) => {
        clearHighlight(pieChart);
        currentIndexRef.current = params?.dataIndex;
      });
      pieChart.on('mouseout', () => {
        clearHighlight(pieChart);
        basicRosePieRef.current = setInterval(function() {
          timerHighlight(pieChart);
        }, 3000);
      });
      // 图随窗口的变化而变化
      window.addEventListener('resize', function() {
        pieChart.resize();
      });
    }
  }, [data]);

  /**
   * 定时高亮
   * @param pieChart 图
   */
  const timerHighlight = (pieChart: any) => {
    let curIndex = currentIndexRef.current;
    let dataLen = data?.data?.length;
    // 取消高亮
    pieChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: curIndex,
    });
    currentIndexRef.current = (curIndex + 1) % dataLen;
    curIndex = (curIndex + 1) % dataLen;
    // 设置高亮
    pieChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: curIndex || 0,
    });
  };
  /**
   * 清除高亮定时器
   * @param pieChart 图
   */
  const clearHighlight = (pieChart: any) => {
    const curIndex = currentIndexRef?.current;
    if (basicRosePieRef?.current) {
      // 取消高亮
      pieChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: curIndex,
      });
      clearInterval(basicRosePieRef.current);
      basicRosePieRef.current = undefined;
    }
  };

  /***
   * 获取option
   */
  function getOption() {
    let colors = ['#64D4DB', '#F26C4F', '#D0E3FE', '#4B9ACB', '#2BC191'];
    return {
      title: {
        text: '统计\n占比',
        x: 'center',
        top: '32%',
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#25629B',
      },
      legend: {
        top: 'bottom',
        textStyle: {
          color: '#fff',
        },
      },
      color: colors,
      series: [
        {
          name: data.name || '',
          type: 'pie',
          radius: ['30%', '65%'],
          center: ['50%', '40%'],
          roseType: 'area',
          label: {
            formatter: '{b}\n{c}({d}%)',
          },
          itemStyle: {
            borderRadius: 8,
          },
          data: data.data,
        },
      ],
    };
  }

  return (
    <div className={props?.className} style={{ width: '100%', height: '100%' }}>
      <div id={id} style={{ width: '100%', height: '100%', zIndex: '99999' }} />
    </div>
  );
};
export default BasicRosePie;
