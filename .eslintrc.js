module.exports = {
  // extends：继承一组预设规则集，统一团队基础规范
  extends: [
    require.resolve('@umijs/fabric/dist/eslint'), // Umi 官方推荐的 ESLint 规则合集
    // 'eslint:recommended', // ESLint 官方推荐规则
    // 'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
  ],
  // plugins：启用对应插件，以便在 rules 中使用其规则
  // plugins: [
  //   'react', // 提供 React/JSX 相关规则，如 react/jsx-pascal-case
  //   '@typescript-eslint', // 提供 TS 专属规则，如 @typescript-eslint/naming-convention
  //   'check-file', // 提供文件命名校验规则
  // ],
  // // settings：为部分插件提供上下文信息（如 React 版本自动探测）
  // settings: {
  //   react: {
  //     version: 'detect', // 自动检测已安装的 React 版本
  //   },
  // },
  // // globals：声明在运行时已存在的全局变量，避免被误报为未定义
  // globals: {
  //   ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
  //   page: true,
  //   REACT_APP_ENV: true,
  // },
  // // rules：项目的自定义校验细则（在 extends 基础上叠加/覆盖）
  // rules: {
  //   '@typescript-eslint/no-parameter-properties': 'off',
  //   // React 组件必须使用大驼峰命名（PascalCase）
  //   'react/jsx-pascal-case': ['error', {
  //     allowAllCaps: false, // 不允许全大写
  //     allowNamespace: false, // 不允许命名空间
  //     ignore: [] // 不忽略任何情况
  //   }],
  //   // 强制变量/成员必须显式类型（放宽解构：允许通过泛型推断，如 useState<boolean>）
  //   '@typescript-eslint/typedef': ['error', {
  //     'variableDeclaration': true,
  //     'memberVariableDeclaration': true,
  //     'propertyDeclaration': true,
  //     'parameter': false,
  //     'arrayDestructuring': false,
  //     'objectDestructuring': false
  //   }],
  //   // 禁止使用 any，能自动建议替换为 unknown
  //   '@typescript-eslint/no-explicit-any': ['error', {
  //     'ignoreRestArgs': false
  //   }],
  //   // 未使用变量/参数：统一使用 TS 版本规则并直接报错；以 _ 开头可按约定忽略
  //   'no-unused-vars': 'off',
  //   '@typescript-eslint/no-unused-vars': ['error', {
  //     'argsIgnorePattern': '^_',
  //     'varsIgnorePattern': '^_',
  //     'caughtErrorsIgnorePattern': '^_'
  //   }],
  //   // 类名必须使用 PascalCase 大驼峰式命名法
  //   '@typescript-eslint/naming-convention': [
  //     'error',
  //     {
  //       'selector': 'class',
  //       'format': ['PascalCase']
  //     }
  //   ],
  //   // 文件夹命名校验规则
  //   'check-file/folder-naming-convention': [
  //     'warn',
  //     {
  //       // pages 目录下的文件夹必须使用 PascalCase 大驼峰命名
  //       'src/pages/**/': 'PASCAL_CASE',
  //       // services 目录下的文件夹必须使用 camelCase 小驼峰命名
  //       'src/services/**/': 'CAMEL_CASE',
  //       // models 目录下的文件夹必须使用 camelCase 小驼峰命名
  //       'src/models/**/': 'CAMEL_CASE',
  //     }
  //   ],

  //   // 文件名命名校验规则
  //   'check-file/filename-naming-convention': [
  //     'warn',
  //     {
  //       // 所有 TSX 组件文件必须使用 PascalCase 大驼峰命名
  //       '**/*.tsx': 'PASCAL_CASE',
  //       // 所有 TS 与 JS 文件必须使用 camelCase 小驼峰命名
  //       '**/*.ts': 'CAMEL_CASE',
  //       '**/*.js': 'CAMEL_CASE',
  //     }
  //   ],

  //   // 自定义规则：禁止未标注类型的以大写开头的变量（阻止把普通函数/变量误写成组件命名）
  //   'no-restricted-syntax': [
  //     'error',
  //     {
  //       'selector': 'VariableDeclarator[id.name=/^[A-Z_]+$/]',
  //       'message': '命名不规范，请使用小驼峰命名，组件请使用显式类型或大驼峰'
  //     },
  //     {
  //       // 仅对简单标识符要求显式类型（解构由泛型场景放行，如 const [s] = useState<boolean>(...)）
  //       'selector': 'VariableDeclarator[id.type="Identifier"]:not([id.typeAnnotation]):not([init.type="ArrowFunctionExpression"]):not([init.type="FunctionExpression"])',
  //       'message': '变量必须显式声明类型或接口，请添加类型注解（例如：const a: number = ...）'
  //     },
  //     {
  //       // useState 必须显式提供泛型类型
  //       'selector': 'CallExpression[callee.name="useState"]:not([typeArguments])',
  //       'message': 'useState 必须显式提供泛型类型（例如：useState<boolean>(false)）'
  //     },
  //     {
  //       // 禁止使用 !important CSS 声明
  //       'selector': 'Literal[value=/!important/]',
  //       'message': '禁止使用 !important，请使用更具体的 CSS 选择器或调整样式优先级'
  //     },
  //     {
  //       // 禁止使用内联样式
  //       'selector': 'JSXAttribute[name.name="style"]',
  //       'message': '禁止使用内联样式，请使用 CSS 类或样式文件'
  //     },
  //     {
  //       // 限制 for 循环嵌套最多两层
  //       'selector': 'ForStatement > BlockStatement > ForStatement > BlockStatement > ForStatement',
  //       'message': 'for 循环嵌套最多只能使用两层，请重构代码'
  //     },
  //     {
  //       // 限制 forEach 嵌套最多两层
  //       'selector': 'CallExpression[callee.property.name="forEach"] CallExpression[callee.property.name="forEach"] CallExpression[callee.property.name="forEach"]',
  //       'message': 'forEach 循环嵌套最多只能使用两层，请重构代码'
  //     },
  //     {
  //       // 限制 for 和 forEach 混合嵌套最多两层
  //       'selector': 'ForStatement CallExpression[callee.property.name="forEach"] CallExpression[callee.property.name="forEach"]',
  //       'message': 'for 和 forEach 混合嵌套最多只能使用两层，请重构代码'
  //     },
  //     {
  //       // 限制 forEach 和 for 混合嵌套最多两层
  //       'selector': 'CallExpression[callee.property.name="forEach"] ForStatement ForStatement',
  //       'message': 'forEach 和 for 混合嵌套最多只能使用两层，请重构代码'
  //     },
  //     {
  //       // 限制 if 语句条件最多三个
  //       'selector': 'IfStatement[test.type="LogicalExpression"]:has(LogicalExpression > LogicalExpression > LogicalExpression)',
  //       'message': 'if 语句的判断条件最多只能存在三个，请简化条件或拆分为多个 if 语句'
  //     },
  //     {
  //       // 枚举名必须使用 PascalCase 大驼峰式命名法
  //       'selector': 'TSEnumDeclaration[id.name=/^[a-z]/]',
  //       'message': '枚举名必须使用 PascalCase 大驼峰式命名法（如：UserStatus 而不是 userStatus）'
  //     },
  //     {
  //       // 枚举属性必须使用全大写+下划线分隔
  //       'selector': 'TSEnumMember[id.name=/^[a-z]/]',
  //       'message': '枚举属性必须使用全大写+下划线分隔（如：ACTIVE_USER 而不是 activeUser）'
  //     },
  //   ],
  // },
  // // env：指定代码运行环境，启用相应全局变量与语法支持
  // env: {
  //   browser: true,
  //   es2021: true,
  //   node: true,
  // },
  // // parser：告诉 ESLint 如何解析源码；TS 项目需使用 @typescript-eslint/parser
  // parser: '@typescript-eslint/parser',
  // // parserOptions：解析器的详细选项
  // parserOptions: {
  //   ecmaVersion: 'latest', // 允许解析的最新 ECMAScript 语法特性
  //   sourceType: 'module', // 启用 ES Modules 语法（import/export）
  //   project: './tsconfig.json', // 让 TS 规则能获取类型信息（需与项目路径匹配）
  //   tsconfigRootDir: __dirname, // 指定 tsconfig 的根目录
  // },
  // // overrides：对特定文件/目录的规则进行定制覆盖
  // overrides: [
  //   {
  //     files: ['.eslintrc.js'],
  //     rules: {
  //       // 配置文件中允许较长的标识符（如特殊全局常量名）
  //       'id-length': 'off',
  //       // 配置文件中允许使用 !important 字符串（用于规则描述）
  //       'no-restricted-syntax': 'off',
  //     },
  //   },
  //   {
  //     // pages 下的 index.tsx 与 columns.tsx 不做文件名校验
  //     files: ['src/pages/**/index.tsx', 'src/pages/**/columns.tsx'],
  //     rules: {
  //       'check-file/filename-naming-convention': 'off',
  //     },
  //   },
  // ],
};
