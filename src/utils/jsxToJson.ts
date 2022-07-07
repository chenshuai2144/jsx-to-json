import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXIdentifier,
  JSXSpreadChild,
  JSXText,
} from '@babel/types';
import generator from '@babel/generator';
import prettier from 'prettier/standalone.js';
import prettierBabel from 'prettier/parser-babel.js';
import { JsxToJsonType } from './typing';
import { FORM_TO_VALUE_TYPE_MAP, FORM_TYPE_LIST } from './const';

/**
 * 将 Schema Form  转换为 ProForm 配置
 * @param jsx code string
 * @returns JsxToJsonType
 */
export const jsxToJson = (jsx: string): JsxToJsonType[] => {
  const demoList: string[] = [];
  const configList: JsxToJsonType[] = [];
  const ast = parse(jsx, {
    // parse in strict mode and allow module declarations
    sourceType: 'module',
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'typescript',
    ],
  });

  const formJSXNode: { type: string; code: string }[] = [];
  traverse(ast, {
    JSXElement(path) {
      const jsxName = (path.node.openingElement.name as JSXIdentifier).name;
      if (FORM_TYPE_LIST.includes(jsxName)) {
        formJSXNode.push({ type: jsxName, code: generator(path.node).code });
      }
    },
  });
  formJSXNode.forEach(({ type, code }) => {
    let columnsList: (string | undefined)[] = [];
    let formPropsList: string[] = [];
    const ast = parse(code, {
      // parse in strict mode and allow module declarations
      sourceType: 'module',
      plugins: [
        // enable jsx and flow syntax
        'jsx',
      ],
    });

    const formAst = ast.program.body.at(0);
    if (formAst?.type === 'ExpressionStatement' && formAst?.expression.type === 'JSXElement') {
      // 拼接 from 的语法树
      const formNode = formAst.expression;
      formPropsList = formNode.openingElement.attributes.map((node) => {
        return generator(node).code;
      });

      const formChildren = formAst.expression.children;
      const mapChildren = (
        childrenNode: JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment,
      ) => {
        if (childrenNode.type === 'JSXElement') {
          let jsxName = (childrenNode.openingElement.name as JSXIdentifier).name;
          // xxx.xx 类型的组件
          if (childrenNode.openingElement.name.type === 'JSXMemberExpression') {
            jsxName =
              (childrenNode.openingElement.name.object as JSXIdentifier).name +
              '.' +
              childrenNode.openingElement.name.property.name;
          }

          const openingElement = childrenNode.openingElement;

          const nodeList = openingElement.attributes
            .map((node) => {
              if (!(node as JSXAttribute).value) return;

              const valueNode = (node as JSXAttribute).value;
              if (valueNode?.type === 'StringLiteral') {
                return {
                  key: (node as JSXAttribute).name.name,
                  value: generator(valueNode).code,
                };
              }
              if (valueNode?.type === 'JSXElement') {
                return {
                  key: (node as JSXAttribute).name.name,
                  value: generator(valueNode).code,
                };
              }
              if (valueNode?.type === 'JSXExpressionContainer') {
                return {
                  key: (node as JSXAttribute).name.name,
                  value: generator(valueNode.expression).code,
                };
              }
              if (valueNode?.type === 'JSXFragment') {
                return {
                  key: (node as JSXAttribute).name.name,
                  value: generator(valueNode).code,
                };
              }
              return;
            })
            .filter(Boolean)
            .map((node) => {
              return `"${node!.key}":${node!.value}`;
            });

          const children: (string | undefined)[] = childrenNode.children
            .map(mapChildren)
            .filter(Boolean);

          if (children?.length > 0) {
            return `{ 
              valueType:"${FORM_TO_VALUE_TYPE_MAP[jsxName] || 'text'}",
              columns:[${children.join(',')}],
              ${nodeList.join(',')}
            }`;
          }
          return `{ 
                    valueType:"${FORM_TO_VALUE_TYPE_MAP[jsxName] || 'text'}",
                    ${nodeList.join(',')}
                  }`;
        }
      };
      const codeList = formChildren.map(mapChildren).filter(Boolean);
      columnsList = columnsList.concat(codeList);
    }
    demoList.push(
      prettier.format(
        `<BetaSchemaForm ${formPropsList.join(
          ' ',
        )}  layoutType="${type}" columns={[${columnsList.join(',')}]} />`,
        { plugins: [prettierBabel] },
      ),
    );
    configList.push({
      code: prettier.format(
        `<BetaSchemaForm ${formPropsList.join(
          ' ',
        )}  layoutType="${type}" columns={[${columnsList.join(',')}]} />`,
        { plugins: [prettierBabel] },
      ),
      columns: columnsList.join(','),
      layoutType: type as 'ProForm',
      props: formPropsList.join(' '),
    });
  });
  return configList;
};
