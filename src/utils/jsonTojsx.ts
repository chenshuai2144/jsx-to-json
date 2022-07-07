import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  Expression,
  IfStatement,
  jsxAttribute,
  JSXExpressionContainer,
  jsxExpressionContainer,
  jsxIdentifier,
  JSXIdentifier,
  ReturnStatement,
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
      'typescript',
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

  const findIfItemReturnReturnStatement = (node: IfStatement): ReturnStatement | undefined => {
    if (node.consequent.type === 'BlockStatement') {
      const item = node.consequent.body.find((item) => item.type === 'ReturnStatement');
      if (item?.type === 'ReturnStatement') return item;
    }
    if (node.consequent.type === 'IfStatement') {
      return findIfItemReturnReturnStatement(node.consequent);
    }
  };

  const traverseReturnStatement = (item: ReturnStatement): Expression | null => {
    let returnArray: Array<null | Expression | SpreadElement> = ([] = []);
    if (item.argument?.type === 'ArrayExpression') {
      returnArray = item.argument.elements;
    }
    if (item.argument?.type === 'Identifier') {
      returnArray = identifierMap.get(item.argument.name).elements;
    }
    const returnColumns = returnArray.map(mapNodeArray);
    const returnAst = parse(
      returnColumns.length > 1 ? `<>${returnColumns.join('\n')}</>` : `${returnColumns.join('\n')}`,
      {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      },
    );
    const newNode = returnAst.program.body.at(0);
    if (newNode?.type === 'ExpressionStatement') {
      return newNode.expression;
    }
    return null;
  };

  const mapNodeArray = (node: null | Expression | SpreadElement): string => {
    if (!node) return '';
    if (node?.type === 'ObjectExpression') {
      let valueType = 'text';
      let children: string[] = [];
      const propsList = node.properties
        .map((node) => {
          if (node.type === 'ObjectProperty') {
            if (
              node.key.type === 'Identifier' &&
              node.key.name === 'valueType' &&
              node.value.type === 'StringLiteral'
            ) {
              valueType = node.value.value || 'text';
              return;
            }

            if (node.key.type === 'Identifier') {
              const jsxName = jsxIdentifier(node.key.name);
              let jsxValue: JSXExpressionContainer | Expression | StringLiteral =
                jsxExpressionContainer(node.value as Expression);
              if (node.value.type === 'StringLiteral') {
                jsxValue = node.value;
              }

              if (node.key.name === 'columns' && jsxValue.type === 'JSXExpressionContainer') {
                let nodeArray: Array<null | Expression | SpreadElement> = [];

                // 如果是外面定义的
                if (jsxValue.expression.type === 'Identifier') {
                  nodeArray = identifierMap.get(jsxValue.expression.name).elements;
                }
                if (jsxValue.expression.type === 'ArrayExpression') {
                  nodeArray = jsxValue.expression.elements;
                }
                if (jsxValue.expression.type === 'ArrowFunctionExpression') {
                  const functionAst = jsxValue.expression.body;
                  if (functionAst.type === 'BlockStatement') {
                    let functionBodyAst = functionAst.body;
                    functionBodyAst.map((item) => {
                      if (item.type === 'ReturnStatement') {
                        item.argument = traverseReturnStatement(item);
                      }
                      if (item.type === 'IfStatement') {
                        const returnNode = findIfItemReturnReturnStatement(item);
                        if (returnNode) {
                          returnNode.argument = traverseReturnStatement(returnNode);
                        }
                      }
                    });
                  }
                  children = [generate(jsxValue).code];
                  return '';
                }
                children = nodeArray.map(mapNodeArray);
                return '';
              }
              const jsxNode = jsxAttribute(jsxName, jsxValue);
              return generate(jsxNode).code;
            }
          }
        })
        .filter(Boolean);
      const jsxName = VALUE_TYPE_TO_FORM_MAP[valueType as 'text'] || 'ProFormText';

      if (children && children.length > 0) {
        return `<${jsxName} ${propsList.join(' ')} >${children.join('\n')}</${jsxName}>`;
      }
      return `<${jsxName} ${propsList.join(' ')} />`;
    }
    return '';
  };
  formJSXNode.forEach(({ type, code }) => {
    let columnsList: string[] = [];
    let formType = 'ProForm';
    let formComponentsList: string[] = [];
    const ast = parse(code, {
      // parse in strict mode and allow module declarations
      sourceType: 'module',
      plugins: [
        // enable jsx and flow syntax
        'jsx',
        'typescript',
      ],
    });
    const formAst = ast.program.body.at(0);
    if (formAst?.type === 'ExpressionStatement' && formAst?.expression.type === 'JSXElement') {
      // 拼接 from 的语法树
      const formNode = formAst.expression;
      formComponentsList = formNode.openingElement.attributes
        .map((node) => {
          if (node.type === 'JSXAttribute') {
            const name = (node.name as JSXIdentifier).name;
            if (name === 'layoutType') {
              formType = (node.value as StringLiteral).value;
              return '';
            }
            if (name === 'columns') {
              columnsList = [];
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
                columnsList.push(nodeArray.map(mapNodeArray).join('\n'));
                return '';
              }
              return '';
            }
          }
          return generator(node).code;
        })
        .filter(Boolean);
    }

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
