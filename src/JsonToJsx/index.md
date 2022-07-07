---
nav:
  title: Components
  path: /components
---

## JsxToJson

Demo:

```tsx
import React from 'react';
import { JsxToJson, JsonToJsx } from 'jsxToJson';

export default () => (
  <>
    <JsxToJson title="First Demo" />
  </>
);
```

## JsonToJsx

```tsx
import React from 'react';
import { JsxToJson, JsonToJsx } from 'jsxToJson';

export default () => (
  <>
    <JsonToJsx
      json={`
  /**
   * 目前代码根据配置生成，要在生产环境中使用还需要二次加工整合到项目中。
   */
  import React from '@alipay/bigfish/react';
  import { BetaSchemaForm } from '@ant-design/pro-components';
  import services from '@/services/afs2demo';

  const Page: React.FC = () => {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
      },
      {
        title: 'nick',
        dataIndex: 'nickName',
        valueType: 'text',
      },
      {
        title: 'email',
        dataIndex: 'email',
        valueType: 'text',
      },
    ];

    return (
      <BetaSchemaForm
        size="middle"
        layout="vertical"
        labelWrap={false}
        labelAlign="right"
        columns={columns}
        request={async (params) => {
          const { success = false } = await services.UserController.addUser({ ...params });
          return success;
        }}
      />
    );
  };

 
  export default Page;`}
    />
  </>
);
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
