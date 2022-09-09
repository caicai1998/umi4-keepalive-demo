// 运行时配置

import { RunTimeLayoutConfig } from '@umijs/max';
import { message, Tabs } from 'antd';

const { TabPane } = Tabs;

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

export const getCustomTabs = () => {
  return ({
    isKeep,
    keepElements,
    navigate,
    dropByCacheKey,
    local,
    activeKey,
  }: any) => {
    return (
      <div className="rumtime-keep-alive-tabs-layout" hidden={!isKeep}>
        <Tabs
          hideAdd
          onChange={(key: string) => {
            navigate(key);
          }}
          activeKey={activeKey}
          type="editable-card"
          onEdit={(targetKey: string) => {
            let newActiveKey = activeKey;
            let lastIndex = -1;
            const newPanel = Object.keys(keepElements.current);
            for (let i = 0; i < newPanel.length; i++) {
              if (newPanel[i] === targetKey) {
                lastIndex = i - 1;
              }
            }
            const newPanes = newPanel.filter((pane) => pane !== targetKey);
            if (newPanes.length && newActiveKey === targetKey) {
              if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex];
              } else {
                newActiveKey = newPanes[0];
              }
            }
            if (lastIndex === -1 && targetKey === location.pathname) {
              message.info('至少要保留一个窗口');
            } else {
              dropByCacheKey(targetKey);
              if (newActiveKey !== location.pathname) {
                navigate(newActiveKey);
              }
            }
          }}
        >
          {Object.entries(keepElements.current).map(
            ([pathname, element]: any) => (
              <TabPane tab={`${local[pathname] || pathname}`} key={pathname} />
            ),
          )}
        </Tabs>
      </div>
    );
  };
};
