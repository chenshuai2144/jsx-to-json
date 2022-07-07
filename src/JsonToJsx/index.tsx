import React, { useEffect, useState } from 'react';
import { jsonToJsx } from '../utils/jsonToJsx';
import { jsxToJson } from '../utils/jsxToJson';

/**
 * 将 ProForm  转换为 Schema Form 配置 并且展示出来的组件
 * @param props
 * @returns
 */
export const JsxToJson: React.FC<{
  jsx: string;
  className?: string;
}> = (props) => {
  const srcCode = props.jsx;
  const [code, setCode] = useState('');
  useEffect(() => {
    if (!props.jsx) return;
    setCode(
      jsxToJson(props.jsx)
        .map((item) => item.code)
        .join('\n'),
    );
  }, [srcCode]);
  return (
    <div className={props.className}>
      <pre
        style={{
          border: '1px solid #DDD',
          padding: 24,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const JsonToJsx: React.FC<{
  json: string;
  className?: string;
}> = (props) => {
  const [code, setCode] = useState('');
  useEffect(() => {
    if (!props.json) return;
    setCode(
      jsonToJsx(props.json)
        .map((item) => item.code)
        .join('\n'),
    );
  }, [props.json]);
  return (
    <div className={props.className}>
      <pre
        style={{
          border: '1px solid #DDD',
          padding: 24,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};
