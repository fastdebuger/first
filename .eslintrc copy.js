// ESLint 配置文件（CommonJS 模块规范，用于 Node.js 环境加载）
module.exports = {
  // ====================
  // 1. 继承已有配置（复用成熟规则集，减少重复配置）
  // ====================
  extends: [
    // 继承 UMI 框架官方的 ESLint 规则（包含 React/TS/最佳实践等基础规则）
    require.resolve('@umijs/fabric/dist/eslint'),
    // 继承 ESLint 官方推荐的基础规则（覆盖 JS 语法错误、常见 bug 检查）
    'eslint:recommended',
    // 继承 @typescript-eslint 插件的推荐规则（覆盖 TS 语法、类型相关的基础检查）
    'plugin:@typescript-eslint/recommended',
  ],

  // ====================
  // 2. 声明全局变量（避免未声明变量报错）
  // ====================
  globals: {
    // UMI/Ant Design Pro 框架内置的全局变量（生产环境禁用，开发调试用）
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    // 可能是项目自定义的全局变量（如分页相关的全局方法/对象）
    page: true,
    // 项目环境变量（如区分开发/测试/生产环境，通常在 .env 文件中定义）
    REACT_APP_ENV: true,
  },

  // ====================
  // 3. 自定义规则（优先级最高，会覆盖继承的规则）
  // 规则值说明："off"(0) 禁用、"warn"(1) 警告（不中断 lint）、"error"(2) 错误（中断 lint）
  // ====================
  rules: {
    // 函数最大行数从 50 放宽到 100（或设为 warn 减少报错中断）
    // 'max-lines-per-function': ['warn', 100],
    // 如需保留，可关闭或降低以下高成本规则
    complexity: 'off', // 关闭代码复杂度检查（如需可设较高阈值）
    'sonarjs/cognitive-complexity': 'off', // 若使用 sonarjs 插件
    // 先禁用之前可能开启的 "no-restricted-syntax" 规则（避免冲突，后续会重新配置）
    // 'no-restricted-syntax': 0,

    // --------------------
    // 3.1 命名规范（强制代码命名统一，提升可读性）
    // --------------------
    // 强制使用驼峰命名（camelCase），尤其是对象属性
    camelcase: ['error', { properties: 'always' }],
    // 禁止变量/函数名以下划线 "_" 开头（避免和私有变量混淆）
    'no-underscore-dangle': 'error',

    // 更细粒度的 TS 命名规范（覆盖变量、函数、类等不同场景）
    '@typescript-eslint/naming-convention': [
      'error', // 不满足规则时报错
      // 场景1：变量、函数、方法 → 必须用驼峰命名（camelCase），禁止下划线开头
      {
        selector: 'variableLike', // 匹配变量、函数、方法（ESLint 内置选择器）
        format: ['camelCase'], // 允许的命名格式
        leadingUnderscore: 'forbid', // 禁止下划线开头
      },
      // 场景2：函数 → 允许驼峰（普通函数）或帕斯卡（构造函数/类组件）命名
      {
        selector: 'function', // 匹配函数
        format: ['camelCase', 'PascalCase'], // 普通函数用 camelCase，构造函数用 PascalCase
        // custom: { // 额外自定义规则：函数名必须以大写字母开头（配合 PascalCase 场景）
        //   regex: '^[A-Z][a-zA-Z0-9]*$', // 正则：首字母大写，后续字母数字
        //   match: true, // 必须匹配该正则
        // },
        // filter: { // 过滤规则：只对符合正则的函数生效（和 custom 逻辑一致，此处可简化）
        //   regex: '^[A-Z][a-zA-Z0-9]*$',
        //   match: true,
        // },
      },
      // 场景3：类、接口、类型别名 → 必须用帕斯卡命名（PascalCase，首字母大写）
      {
        selector: 'typeLike', // 匹配类、接口、type 定义
        format: ['PascalCase'],
      },
      // 场景4：枚举成员 → 必须用全大写+下划线命名（UPPER_CASE_SNAKE_CASE）
      {
        selector: 'enumMember', // 匹配枚举中的成员
        format: ['UPPER_CASE'],
      },
      // 场景5：const 常量 → 必须用全大写命名（区分普通变量和常量）
      {
        selector: 'variable', // 匹配变量
        modifiers: ['const'], // 只对 const 声明的变量生效
        format: ['UPPER_CASE'], // 必须加！允许全大写（如 MAX_NUM）或驼峰（如 userInfo）
        filter: {
          regex: '^[A-Z][A-Z0-9_]*$',
          match: true,
        }
      },
      // 场景6：布尔变量 → 必须以 is/has/can 等前缀开头（提升语义，如 isVisible、hasPermission）
      {
        selector: 'variable', // 匹配变量
        types: ['boolean'], // 只对布尔类型变量生效
        format: ['PascalCase'], // 配合前缀，如 isReady（首字母小写？此处可能是配置疏忽，通常布尔变量用 camelCase）
        prefix: ['is', 'has'], // 强制前缀 // 'can', 'should', 'will', 'did'
      },
    ],

    // --------------------
    // 3.2 注释规范（提升代码可维护性，建议性规则）
    // --------------------
    // 注释前后必须加空格（如 // 注释内容，而非 //注释内容），块状注释需括号平衡
    'spaced-comment': ['warn', 'always', { block: { balanced: true } }],

    // --------------------
    // 3.3 语法与代码安全（避免低级 bug 和不规范写法）
    // --------------------
    // 3.3.1 禁止使用 var 声明变量（避免变量提升导致的作用域问题，强制用 let/const）
    'no-var': 'error',

    // 3.3.2 强制使用 ===/!== 比较（避免 ==/!= 的隐式类型转换，如 0 == "" 为 true 的坑）
    eqeqeq: ['error', 'always'],

    // 3.3.3 警告：循环内避免创建函数表达式（防止闭包陷阱，如 for 循环内定义函数导致的变量共享问题）
    'no-loop-func': 'warn',

    // 3.3.4 强制 parseInt 必须传第二个参数（进制）（避免默认十进制但输入八进制数字的坑，如 parseInt("010") 旧环境会解析为 8）
    radix: 'error',

    // 禁止使用无进制参数的 parseInt（和上面 radix 规则互补，更明确的错误提示）
    'no-restricted-syntax': [
      'error',
      {
        // 匹配 "parseInt(xxx)" 这种无第二个参数的调用
        selector: 'CallExpression[callee.name="parseInt"][arguments.length=1]',
        message: 'parseInt 必须指定进制，例如 parseInt(str, 10)', // 自定义错误提示
      },
    ],

    // 3.3.5 禁止用 new Object() 创建对象（强制用 {} 字面量，更简洁）
    'no-new-object': 'error',

    // 3.3.6 禁止用 new Array() 创建数组（强制用 [] 字面量，更简洁）
    'no-array-constructor': 'error',

    // 3.3.7 警告：函数代码不能超过 50 行（避免函数过大导致可读性差，建议拆分函数）
    'max-lines-per-function': ['warn', 100],

    // --------------------
    // 3.4 TS 类型安全（额外严格规则，避免类型相关 bug）
    // --------------------
    // 禁止显式使用 any 类型（强制指定具体类型，避免失去 TS 类型检查的意义）
    '@typescript-eslint/no-explicit-any': 'error',
    // 允许显式声明可推导的类型（如 let x: number = 1，默认规则会警告，此处关闭警告）
    '@typescript-eslint/no-inferrable-types': 'off',
    // 禁止未使用的变量（避免冗余代码，减少内存占用）
    '@typescript-eslint/no-unused-vars': ['error'],

    // 强制 TS 类型导入用 import type 语法（区分类型导入和普通导入，优化打包体积）
    // 如 import type { User } from './types'，而非 import { User } from './types'
    '@typescript-eslint/consistent-type-imports': 'error',

    // --------------------
    // 3.5 导入规范（统一 import 顺序，提升可读性）
    // --------------------
    'import/order': [
      'warn', // 不满足规则时警告
      {
        // 导入分组顺序（按优先级从高到低）
        groups: [
          'builtin', // 1. Node.js 内置模块（如 fs、path）
          'external', // 2. 第三方依赖（如 react、lodash）
          'internal', // 3. 项目内部自定义模块（如 @/utils）
          'parent', // 4. 父级目录文件（如 ../components/Button）
          'sibling', // 5. 同级目录文件（如 ./utils）
          'index', // 6. 当前目录 index 文件（如 ./index）
        ],
        alphabetize: { order: 'asc' }, // 每个分组内的导入按字母顺序排序（A-Z）
      },
    ],
  },

  // ====================
  // 4. 声明代码运行环境（ESLint 会根据环境启用对应的全局变量和语法支持）
  // ====================
  env: {
    browser: true, // 支持浏览器环境（如 window、document 全局变量）
    es2021: true, // 支持 ES2021 语法（如 Promise.any、String.prototype.replaceAll）
    node: true, // 支持 Node.js 环境（如 require、module 全局变量）
  },

  // ====================
  // 5. 指定解析器（告诉 ESLint 如何解析代码，此处用于解析 TS）
  // ====================
  parser: '@typescript-eslint/parser', // TS 专用解析器（替代 ESLint 默认的 JS 解析器）

  // ====================
  // 6. 解析器选项（配置解析器的行为）
  // ====================
  parserOptions: {
    ecmaVersion: 'latest', // 支持最新的 ES 语法
    sourceType: 'module', // 代码使用 ES 模块规范（import/export，而非 CommonJS 的 require）
    project: './tsconfig.json', // 关联项目的 TS 配置文件（让 ESLint 能获取 TS 类型信息，实现更精准的检查）
    tsconfigRootDir: __dirname, // TS 配置文件的根目录（__dirname 表示当前 ESLint 配置文件所在目录）
  },
  ignorePatterns: ['dist/', 'build/', '.umi/', '*.config.js','*.js.map'], // 直接忽略这些路径
};