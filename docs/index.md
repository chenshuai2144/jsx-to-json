---
hero:
  title: jsxToJson
  desc: jsxToJson site example
  actions:
    - text: Getting Started
      link: /components

footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

# Hello jsxToJson!

## Getting Started

Install dependencies,

```bash
npm i @chenshuai2144/jsx-to-json
```

### jsxToJson

```tsx | pure
import { jsxToJson } form '@chenshuai2144/jsx-to-json'


const code = `

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
</ProForm>`


console.log(jsxToJson(code).at(0).code);

// <BetaSchemaForm
//   layoutType="ProForm"
//   columns={[
//     {
//       valueType: "money",
//       label: "不显示符号",
//       name: "amount0",
//       fieldProps: {
//         moneySymbol: false,
//       },
//       locale: "en-US",
//       initialValue: 22.22,
//       min: 0,
//       width: "lg",
//    }]
// />

```

### jsonToJsx

```tsx | pure
import { jsonToJsx } form '@chenshuai2144/jsx-to-json'


const code = `
<BetaSchemaForm
  layoutType="ProForm"
  columns={[
    {
      valueType: "money",
      label: "不显示符号",
      name: "amount0",
      fieldProps: {
        moneySymbol: false,
      },
      locale: "en-US",
      initialValue: 22.22,
      min: 0,
      width: "lg",
   }]
/>
`


console.log(jsonToJsx(code).at(0).code);
// <ProForm>
//     formRef={formRef}
//     params={{ id: '100' }}
//     formKey="base-form-use-demo"
//     request={async () => {
//       await waitTime(100);
//       return {
//         name: '蚂蚁设计有限公司',
//         useMode: 'chapter',
//       };
//     }}
//     autoFocusFirstInput
//   >
//     <ProFormMoney
//       label="不显示符号"
//       name="amount0"
//       fieldProps={{
//         moneySymbol: false,
//       }}
//       locale="en-US"
//       initialValue={22.22}
//       min={0}
//       width="lg"
//     />
// </ProForm>

```
