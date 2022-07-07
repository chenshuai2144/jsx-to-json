---
nav:
  title: Components
  path: /components
---

## JsxToJson

Demo:

```tsx
import React from 'react';
import { JsxToJson, JsonToJsx } from '@chenshuai2144/jsx-to-json';

export default () => (
  <>
    <JsxToJson
      jsx={`
   <>
  <ProForm>
    formRef={formRef}
    params={{ id: '100' }}
    formKey="base-form-use-demo"
    request={async () => {
      await waitTime(100);
      return {
        name: '蚂蚁设计有限公司',
        useMode: 'chapter',
      };
    }}
    autoFocusFirstInput
  >
    <ProFormMoney
      label="不显示符号"
      name="amount0"
      fieldProps={{
        moneySymbol: false,
      }}
      locale="en-US"
      initialValue={22.22}
      min={0}
      width="lg"
    />
    <ProFormMoney
      label="宽度"
      name="amount1"
      locale="en-US"
      initialValue={22.22}
      min={0}
      width="lg"
    />
    <ProFormMoney
      label="限制金额最小为0"
      name="amount2"
      locale="en-US"
      initialValue={22.22}
      min={0}
    />
    <ProFormMoney label="不限制金额大小" name="amount3" locale="en-GB" initialValue={22.22} />
    <ProFormMoney label="货币符号跟随全局国际化" name="amount4" initialValue={22.22} />
    <ProFormMoney label="自定义货币符号" name="amount5" initialValue={22.22} customSymbol="💰" />
  </ProForm>
  <ProForm
    submitter={{
      render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
    }}
    onFinish={async (values) => console.log(values)}
  >
    <ProForm.Group>
      <ProFormText
        name="name"
        label="签约客户名称"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
    </ProForm.Group>
    <ProForm.Group>
      <ProFormText name={['contract', 'name']} label="合同名称" placeholder="请输入名称" />
      <ProFormDateRangePicker name={['contract', 'createTime']} label="合同生效时间" />
    </ProForm.Group>
    <ProForm.Group>
      <ProFormSelect
        options={[
          {
            value: 'chapter',
            label: '盖章后生效',
          },
        ]}
        width="xs"
        name="chapter"
        label="合同约定生效方式"
      />
      <ProFormSelect
        width="xs"
        options={[
          {
            value: 'time',
            label: '履行完终止',
          },
        ]}
        name="unusedMode"
        label="合同约定失效效方式"
      />
    </ProForm.Group>
    <ProFormText width="sm" name="id" label="主合同编号" />
    <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
    <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
    <ProForm.Group>
      <ProFormSelect
        initialValue="money"
        options={[
          {
            value: 'money',
            label: '确认金额',
          },
        ]}
        width="xs"
        name="useMode"
        label="金额类型"
      />
      <ProFormSelect
        options={[
          {
            value: '6',
            label: '6%',
          },
          {
            value: '12',
            label: '12%',
          },
        ]}
        initialValue="6"
        width="xs"
        name="taxRate"
        label="税率"
      />
      <ProFormRadio.Group
        label="发票类型"
        name="invoiceType"
        initialValue="发票"
        options={['发票', '普票', '无票']}
      />
    </ProForm.Group>
    <ProFormUploadButton
      extra="支持扩展名：.jpg .zip .doc .wps"
      label="倒签报备附件"
      name="file"
      title="上传文件"
    />
    <ProFormDigit width="xs" name="num" label="合同份数" initialValue={5} />
    <ProFormTextArea width="xl" label="合同备注说明" name="remark" />
  </ProForm>
</>;`}
    />
  </>
);
```

## JsonToJsx

```tsx
import React from 'react';
import { JsxToJson, JsonToJsx } from '@chenshuai2144/jsx-to-json';

export default () => (
  <>
    <JsonToJsx
      json={`
<>
  <BetaSchemaForm
    layoutType="ProForm"
    columns={[
      {
        valueType: 'money',
        label: '不显示符号',
        name: 'amount0',
        fieldProps: {
          moneySymbol: false,
        },
        locale: 'en-US',
        initialValue: 22.22,
        min: 0,
        width: 'lg',
      },
      {
        valueType: 'money',
        label: '宽度',
        name: 'amount1',
        locale: 'en-US',
        initialValue: 22.22,
        min: 0,
        width: 'lg',
      },
      {
        valueType: 'money',
        label: '限制金额最小为0',
        name: 'amount2',
        locale: 'en-US',
        initialValue: 22.22,
        min: 0,
      },
      {
        valueType: 'money',
        label: '不限制金额大小',
        name: 'amount3',
        locale: 'en-GB',
        initialValue: 22.22,
      },
      {
        valueType: 'money',
        label: '货币符号跟随全局国际化',
        name: 'amount4',
        initialValue: 22.22,
      },
      {
        valueType: 'money',
        label: '自定义货币符号',
        name: 'amount5',
        initialValue: 22.22,
        customSymbol: '💰',
      },
    ]}
  />

  <BetaSchemaForm
    submitter={{
      render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
    }}
    onFinish={async (values) => console.log(values)}
    layoutType="ProForm"
    columns={[
      {
        valueType: 'group',
        title: '签约信息',
        columns: [
          {
            valueType: 'text',
            name: 'name',
            label: '签约客户名称',
            tooltip: '最长为 24 位',
            placeholder: '请输入名称',
          },
          {
            valueType: 'text',
            width: 'md',
            name: 'company',
            label: '我方公司名称',
            placeholder: '请输入名称',
          },
        ],
      },
      {
        valueType: 'group',
        columns: [
          {
            valueType: 'text',
            name: ['contract', 'name'],
            label: '合同名称',
            placeholder: '请输入名称',
          },
          {
            valueType: 'dateRange',
            name: ['contract', 'createTime'],
            label: '合同生效时间',
          },
        ],
      },
      {
        valueType: 'group',
        columns: [
          {
            valueType: 'select',
            options: [
              {
                value: 'chapter',
                label: '盖章后生效',
              },
            ],
            width: 'xs',
            name: 'chapter',
            label: '合同约定生效方式',
          },
          {
            valueType: 'select',
            width: 'xs',
            options: [
              {
                value: 'time',
                label: '履行完终止',
              },
            ],
            name: 'unusedMode',
            label: '合同约定失效效方式',
          },
        ],
      },
      {
        valueType: 'text',
        width: 'sm',
        name: 'id',
        label: '主合同编号',
      },
      {
        valueType: 'text',
        name: 'project',
        label: '项目名称',
        initialValue: 'xxxx项目',
      },
      {
        valueType: 'text',
        width: 'xs',
        name: 'mangerName',
        label: '商务经理',
        initialValue: '启途',
      },
      {
        valueType: 'group',
        columns: [
          {
            valueType: 'select',
            initialValue: 'money',
            options: [
              {
                value: 'money',
                label: '确认金额',
              },
            ],
            width: 'xs',
            name: 'useMode',
            label: '金额类型',
          },
          {
            valueType: 'select',
            options: [
              {
                value: '6',
                label: '6%',
              },
              {
                value: '12',
                label: '12%',
              },
            ],
            initialValue: '6',
            width: 'xs',
            name: 'taxRate',
            label: '税率',
          },
          {
            valueType: 'radio',
            label: '发票类型',
            name: 'invoiceType',
            initialValue: '发票',
            options: ['发票', '普票', '无票'],
          },
        ],
      },
      {
        valueType: 'text',
        extra: '支持扩展名：.jpg .zip .doc .wps',
        label: '倒签报备附件',
        name: 'file',
        title: '上传文件',
      },
      {
        valueType: 'progress',
        width: 'xs',
        name: 'num',
        label: '合同份数',
        initialValue: 5,
      },
      {
        valueType: 'textarea',
        width: 'xl',
        label: '合同备注说明',
        name: 'remark',
      },
      {
        valueType: 'dependency',
        name: ['name', ['name2', 'text']],
        columns: (values) => [
          {
            valueType: 'select',
            width: 'md',
            valueEnum: {
              chapter: {
                text: '盖章后生效',
              },
            },
            title: () => {
              return <span id="label_text">values?.name</span>;
            },
          },
        ],
      },
      {
        valueType: 'dependency',
        name: ['type'],
        columns: ({ type }) => {
          if (type === 'money') {
            return [
              {
                dataIndex: 'money',
                title: '优惠金额',
                width: 'm',
                valueType: 'money',
              },
            ];
          }

          if (type === 'discount') {
            return [
              {
                dataIndex: 'discount',
                title: '折扣',
                valueType: 'digit',
                width: 'm',
                fieldProps: {
                  precision: 2,
                },
              },
            ];
          }

          return [
            {
              dataIndex: 'less',
              title: '减免',
              width: 'm',
              valueType: 'money',
            },
          ];
        },
      },
    ]}
  />
</>;
`}
    />
  </>
);
```
