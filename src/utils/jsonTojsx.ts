import React, { useEffect, useState } from 'react';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  Expression,
  jsxAttribute,
  JSXExpressionContainer,
  jsxExpressionContainer,
  jsxIdentifier,
  JSXIdentifier,
  SpreadElement,
  StringLiteral,
} from '@babel/types';
import generator from '@babel/generator';
import prettier from 'prettier/standalone.js';
import prettierBabel from 'prettier/parser-babel.js';
import generate from '@babel/generator';
import { VALUE_TYPE_TO_FORM_MAP } from './const';
import { JsxToJsonType } from './typing';

/**
 * 将 ProForm  转换为 Schema Form 配置
 * @param json code string
 * @returns JsxToJsonType
 */
export const jsonToJsx = (json: string): JsxToJsonType[] => {
  const demoList: JsxToJsonType[] = [];
  const ast = parse(json, {
    // parse in strict mode and allow module declarations
    sourceType: 'module',
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'flow',
    ],
  });

  const formJSXNode: { type: string; code: string }[] = [];

  const identifierMap = new Map();
  traverse(ast, {
    JSXElement(path) {
      const jsxName = (path.node.openingElement.name as JSXIdentifier).name;
      if (jsxName === 'BetaSchemaForm') {
        formJSXNode.push({ type: jsxName, code: generator(path.node).code });
      }
    },
    VariableDeclarator: (path) => {
      if (path.node.id.type === 'Identifier') {
        identifierMap.set(path.node.id.name, path.node.init);
      }
    },
  });
  formJSXNode.forEach(({ type, code }) => {
    let columnsList: string[] = [];
    let formType = 'ProForm';
    let formComponentsList: string[] = [];
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
          if (jsxName === type) {
            formComponentsList = path.node.attributes
              .map((node) => {
                if (
                  node.type === 'JSXAttribute' &&
                  node.name.name === 'columns' &&
                  node.value?.type === 'JSXExpressionContainer'
                ) {
                  let nodeArray: Array<null | Expression | SpreadElement> = [];

                  // 如果是外面定义的
                  if (node.value.expression.type === 'Identifier') {
                    nodeArray = identifierMap.get(node.value.expression.name).elements;
                  }
                  if (node.value.expression.type === 'ArrayExpression') {
                    nodeArray = node.value.expression.elements;
                  }
                  columnsList.push(
                    nodeArray
                      .map((node) => {
                        if (node?.type === 'ObjectExpression') {
                          let valueType = 'text';
                          const propsList = node.properties
                            .map((node) => {
                              if (node.type === 'ObjectProperty') {
                                if (
                                  node.key.type === 'Identifier' &&
                                  node.key.name === 'valueType' &&
                                  node.value.type === 'StringLiteral'
                                ) {
                                  valueType = node.value.value;
                                  return;
                                }
                                if (node.key.type === 'Identifier') {
                                  const jsxName = jsxIdentifier(node.key.name);
                                  let jsxValue:
                                    | JSXExpressionContainer
                                    | Expression
                                    | StringLiteral = jsxExpressionContainer(
                                    node.value as Expression,
                                  );
                                  if (node.value.type === 'StringLiteral') {
                                    jsxValue = node.value;
                                  }
                                  const jsxNode = jsxAttribute(jsxName, jsxValue);
                                  return generate(jsxNode).code;
                                }
                              }
                            })
                            .filter(Boolean);
                          return `<${
                            VALUE_TYPE_TO_FORM_MAP[valueType as 'text'] || 'ProFormText'
                          } ${propsList.join(' ')} />`;
                        }
                        return node;
                      })
                      .join('\n'),
                  );
                  return '';
                }
                if (
                  node.type === 'JSXAttribute' &&
                  node.name.name === 'layoutType' &&
                  node.value?.type === 'StringLiteral'
                ) {
                  formType = node.value.value;
                }
                return generator(node).code;
              })
              .filter(Boolean);
          }
        },
      },
    );
    demoList.push({
      code: prettier.format(
        `<${formType} ${formComponentsList.join(' ')}>${columnsList.join('\n')}</${formType}>`,
        {
          plugins: [prettierBabel],
        },
      ),
      columns: columnsList.join('\n'),
      layoutType: formType as 'ProForm',
      props: formComponentsList.join(' '),
    });
  });

  return demoList;
};
