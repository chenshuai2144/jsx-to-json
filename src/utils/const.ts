export const FORM_TYPE_LIST = [
  'ProForm',
  'LightFilter',
  'QueryFilter',
  'StepsForm',
  'ModalForm',
  'DrawerForm',
];

export const VALUE_TYPE_TO_FORM_MAP = {
  text: 'ProFormText',
  password: 'ProFormText.Password',
  money: 'ProFormMoney',
  option: 'Space',
  textarea: 'ProFormTextArea',
  date: 'ProFormDatePicker',
  dateWeek: 'ProFormDatePicker.Week',
  dateMonth: 'ProFormDatePicker.Month',
  dateQuarter: 'ProFormDatePicker.Quarter',
  dateYear: 'ProFormDatePicker.Year',
  dateTime: 'ProFormDateTimePicker',
  fromNow: 'ProFormDateTimePicker',
  dateRange: 'ProFormDateRangePicker',
  dateTimeRange: 'ProFormDateTimeRangePicker',
  time: 'ProFormTimePicker',
  timeRange: 'ProFormTimeRangePicker',
  select: 'ProFormSelect',
  checkbox: 'ProFormCheckbox.Group',
  rate: 'ProFormRate',
  radio: 'ProFormRadio.Group',
  radioButton: 'ProFormRadio.Group',
  progress: 'ProFormDigit',
  percent: 'ProFormDigit',
  digit: 'ProFormDigit',
  digitRange: 'ProFormDigitRange',
  second: 'ProFormDigit',
  code: 'ProFormTextArea',
  jsonCode: 'ProFormTextArea',
  avatar: 'ProFormText',
  switch: 'ProFormSwitch',
  image: 'ProFormText',
  cascader: 'ProFormCascader',
  treeSelect: 'ProFormTreeSelect',
  color: 'ProFormColorPicker',
};

export const FORM_TO_VALUE_TYPE_MAP = Object.keys(VALUE_TYPE_TO_FORM_MAP)
  .map((key) => {
    return { key: VALUE_TYPE_TO_FORM_MAP[key as keyof typeof VALUE_TYPE_TO_FORM_MAP], value: key };
  })
  .reverse()
  .reduce((acc, cur) => {
    return { ...acc, [cur.key]: cur.value };
  }, {} as { [key: string]: string });
