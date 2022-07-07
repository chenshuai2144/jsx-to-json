import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { JSXAttribute, JSXIdentifier } from '@babel/types';
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
      'flow',
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
    const columnsList: string[] = [];
    let formPropsList: string[] = [];
    traverse(
      parse(code, {
        // parse in strict mode and allow module declarations
        sourceType: 'module',
        plugins: [
          // enable jsx and flow syntax
          'jsx',
          'flow',
        ],
      }),
      {
        JSXOpeningElement(path) {
          const jsxName = (path.node.name as JSXIdentifier).name;

          if (jsxName !== type) {
            const nodeList = path.node.attributes
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
            columnsList.push(`{ 
                    valueType:"${FORM_TO_VALUE_TYPE_MAP[jsxName]}",
                    ${nodeList.join(',')}
                  }`);
          }
          if (jsxName === type) {
            formPropsList = path.node.attributes.map((node) => {
              return generator(node).code;
            });
          }
        },
      },
    );

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
