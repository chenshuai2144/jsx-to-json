export type JsxToJsonType = {
  /**
   * 转化之后的源码
   */
  code: string;
  /**
   * 列配置的代码
   */
  columns: string;
  /**
   * Schema 的 layout 配置
   * @example ProForm,LightFilter,QueryFilter,StepsForm,ModalForm,DrawerForm
   */
  layoutType: 'ProForm' | 'LightFilter' | 'QueryFilter' | 'StepsForm' | 'ModalForm' | 'DrawerForm';
  /**
   * Schema 的 props 的配置
   * @example size="middle" layout="vertical"  labelWrap={false}   labelAlign="right" columns={columns}
   */
  props: string;
};
