/**
 * @description :首页统计模块布局
 * @author：蒋梅
 * @email :1229961908@qq.com
 * @creatTime : 2022/04/21
 */
import React, { ReactNode } from 'react';
import styles from './index.less';

interface HomeCountItemWrapProps {
  /** className名称，自己写样式 */
  className?: string,
  children: any;
  /** 标题 */
  title?:ReactNode,
}

const HomeCountItemWrap = (props: HomeCountItemWrapProps) => {
  const { children } = props;
  return (
    <div className={`${styles.homeCountItemWrap} ${props?.className}`}>
      <div className={styles.titleContent}>
          <i className={styles.iconTitle}/>
          <span>{props?.title||'图表标题'}</span>
      </div>
      <div className={styles.statisticsContent}>{children}</div>
    </div>
  );
};
export default HomeCountItemWrap;
