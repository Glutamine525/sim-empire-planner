import { BuildingColor } from './building-color';

export const BuildingAztec = {
  防: ['哨', '维', '医院'],
  防护: ['哨塔', '维修站点', '医院'],
  普通住宅需求: {
    商业: [
      '粮店',
      '蔬菜摊',
      '水果摊',
      '肉铺',
      '鱼摊',
      '陶器店',
      '可可店',
      '布匹轩',
    ],
    市政: ['水井'],
    文化: ['预备学校', '蹴球场'],
    宗教: ['祈雨神殿', '祭祀神殿', '智慧神殿'],
  },
  高级住宅需求: {
    商业: [
      '粮店',
      '蔬菜摊',
      '水果摊',
      '肉铺',
      '鱼摊',
      '陶器店',
      '可可店',
      '布匹轩',
      '龙舌兰酒',
      '染料货摊',
      '烟草店',
    ],
    市政: ['水井'],
    文化: ['高等学校', '专业学校', '蹴球场', '天文台', '植物园'],
    宗教: ['祭祀神殿', '智慧神殿'],
  },
  住宅: [
    {
      name: '普通住宅',
      text: '宅',
      size: 1,
      range: 0,
      background: BuildingColor['住宅'][0],
    },
    {
      name: '高级住宅',
      text: '高宅',
      size: 2,
      range: 0,
      background: BuildingColor['住宅'][1],
    },
  ],
  农业: [
    {
      name: '玉米田',
      text: '玉米田',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][0],
    },
    {
      name: '番茄园',
      text: '番茄园',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][1],
    },
    {
      name: '牛油果园',
      text: '牛油果',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][2],
    },
    {
      name: '狩猎小屋',
      text: '狩猎',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][3],
    },
    {
      name: '可可园',
      text: '可可园',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][4],
    },
    {
      name: '制羽小屋',
      text: '制羽小屋',
      size: 4,
      range: 0,
      background: BuildingColor['农业'][5],
    },
    {
      name: '烟草园',
      text: '烟草园',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][6],
    },
    {
      name: '龙舌兰园',
      text: '龙舌兰园',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][7],
    },
    {
      name: '仙人掌园',
      text: '仙人掌园',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][8],
    },
    {
      name: '棉花园',
      text: '棉花园',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][9],
    },
  ],
  工业: [
    {
      name: '陶器厂',
      text: '陶器厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][0],
    },
    {
      name: '纺织厂',
      text: '纺织厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][1],
    },
    {
      name: '雕刻厂',
      text: '雕刻厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][2],
    },
    {
      name: '染料场',
      text: '染料场',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][3],
    },
  ],
  商业: [
    {
      name: '粮店',
      text: '粮',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][0],
    },
    {
      name: '蔬菜摊',
      text: '菜',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][1],
    },
    {
      name: '水果摊',
      text: '果',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][2],
    },
    {
      name: '肉铺',
      text: '肉',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][3],
    },
    {
      name: '鱼摊',
      text: '鱼',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][4],
    },
    {
      name: '陶器店',
      text: '陶',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][5],
    },
    {
      name: '可可店',
      text: '可',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][6],
    },
    {
      name: '布匹轩',
      text: '布',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][7],
    },
    {
      name: '龙舌兰酒',
      text: '酒',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][8],
    },
    {
      name: '染料货摊',
      text: '染',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][9],
    },
    {
      name: '烟草店',
      text: '烟',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][10],
    },
  ],
  市政: [
    {
      name: '水井',
      text: '水',
      size: 1,
      range: 4,
      background: BuildingColor['市政']['水'],
    },
    {
      name: '哨塔',
      text: '哨',
      size: 1,
      range: 6,
      background: BuildingColor['市政']['防'],
    },
    {
      name: '维修站点',
      text: '维',
      size: 1,
      range: 6,
      background: BuildingColor['市政']['防'],
    },
    {
      name: '医院',
      text: '医院',
      size: 2,
      range: 7,
      background: BuildingColor['市政']['防'],
    },
    {
      name: '粮仓',
      text: '粮仓',
      size: 3,
      range: 0,
      background: BuildingColor['市政']['粮'],
    },
    {
      name: '货栈',
      text: '货栈',
      size: 3,
      range: 0,
      background: BuildingColor['市政']['货'],
    },
    {
      name: '皇宫',
      text: '皇宫',
      size: 4,
      range: 0,
      background: BuildingColor['市政']['殿'],
    },
    {
      name: '贸易站',
      text: '贸易站',
      size: 3,
      range: 0,
      background: BuildingColor['市政']['贸'],
    },
    {
      name: '税务局',
      text: '税',
      size: 1,
      range: 4,
      background: BuildingColor['市政']['税'],
    },
    {
      name: '大磨坊',
      text: '大磨坊',
      size: 2,
      range: 4,
      background: BuildingColor['市政']['磨'],
    },
    {
      name: '浇灌渠',
      text: '浇灌渠',
      size: 2,
      range: 4,
      background: BuildingColor['市政']['浇'],
    },
  ],
  文化: [
    {
      name: '预备学校',
      text: '预备',
      size: 2,
      range: 7,
      background: BuildingColor['文化'][0],
    },
    {
      name: '高等学校',
      text: '高等学校',
      size: 3,
      range: 8,
      background: BuildingColor['文化'][1],
    },
    {
      name: '专业学校',
      text: '专业学校',
      size: 4,
      range: 8,
      background: BuildingColor['文化'][2],
    },
    {
      name: '蹴球场',
      text: '蹴球场',
      size: 4,
      range: 9,
      background: BuildingColor['文化'][3],
    },
    {
      name: '天文台',
      text: '天文台',
      size: 3,
      range: 10,
      background: BuildingColor['文化'][4],
    },
    {
      name: '植物园',
      text: '植物园',
      size: 6,
      range: 10,
      background: BuildingColor['文化'][5],
    },
  ],
  宗教: [
    {
      name: '祈雨神殿',
      text: '雨',
      size: 1,
      range: 5,
      background: BuildingColor['宗教'][0],
    },
    {
      name: '祭祀神殿',
      text: '祭祀',
      size: 2,
      range: 6,
      background: BuildingColor['宗教'][1],
    },
    {
      name: '智慧神殿',
      text: '智慧神殿',
      size: 3,
      range: 8,
      background: BuildingColor['宗教'][2],
    },
  ],
  军事: [
    {
      name: '步兵兵营',
      text: '步兵',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][0],
    },
    {
      name: '弩兵兵营',
      text: '弩兵',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][1],
    },
    {
      name: '骑兵兵营',
      text: '骑兵兵营',
      size: 3,
      range: 0,
      background: BuildingColor['军事'][2],
    },
    {
      name: '祭坛',
      text: '祭坛',
      size: 3,
      range: 0,
      background: BuildingColor['军事'][3],
    },
    {
      name: '武器铺',
      text: '武器铺',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][4],
    },
    {
      name: '马厩',
      text: '马厩',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][5],
    },
  ],
  美化: [
    {
      name: '树',
      text: '树',
      size: 1,
      range: 0,
      background: BuildingColor['美化']['树'],
    },
  ],
  奇迹: [
    {
      name: '库库尔坎神庙',
      text: '库库尔坎神庙',
      size: 5,
      range: 0,
      background: BuildingColor['奇迹'][0],
    },
    {
      name: '主神庙',
      text: '主神庙',
      size: 7,
      range: 0,
      background: BuildingColor['奇迹'][1],
    },
    {
      name: '月亮金字塔',
      text: '月亮金字塔',
      size: 10,
      range: 0,
      background: BuildingColor['奇迹'][2],
    },
    {
      name: '太阳金字塔',
      text: '太阳金字塔',
      size: 12,
      range: 0,
      background: BuildingColor['奇迹'][3],
    },
  ],
};