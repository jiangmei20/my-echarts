/**
 * @description :圆角条形图
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/06/27
 */
import React, {useEffect} from 'react';
// @ts-ignore
import * as echarts from 'echarts';

interface FilletBarData {
  name?: string;
  /** x轴 */
  x: string[];
  /** 对应的数据 */
  data: number[];
  /** 柱子的颜色 */
  color?:string;
}

interface BasicFilletBarProps {
  /** echarts中图形id */
  id: string;
  /** 条形图的数据 */
  data: FilletBarData;
  /** 样式的类名 */
  className?: string;
  /** 字体大小 */
  echartsFontSize?: number;
}

const BasicFilletBar = (props: BasicFilletBarProps) => {
  const {id, data} = props;

  useEffect(() => {
    const idElement = document.getElementById(id);
    if (idElement) {
      const barChart = echarts?.init(idElement);
      barChart?.setOption(getOption());
      // 图随窗口的变化而变化
      window.addEventListener('resize', function () {
        barChart.resize();
      });
    }
  }, [data]);


  /***
   * 获取option
   */
  function getOption() {
    let color=data?.color||'#4ed8fd';
    return {
      grid: {
        top:'5%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      calculable: true,
      xAxis: {
        type: 'category',
        data: data?.x,
        nameTextStyle: {
          color: '#178676'
        },
        axisLine: {
          lineStyle: {
            color: '#178676',
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {//分隔线
          lineStyle: {
            color: '#178676'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#178676'
          }
        }
      },
      series: [
        {
          name: data?.name || '',
          type: 'bar',
          barCategoryGap: '50%',
          itemStyle: {
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: color
            }
          },
          data: data.data
        }
      ]
    };
  }

  return (
    <div className={props?.className} style={{width: '100%', height: '100%'}}>
      <div id={id} style={{width: '100%', height: '100%'}}/>
    </div>
  );
};
export default BasicFilletBar;
