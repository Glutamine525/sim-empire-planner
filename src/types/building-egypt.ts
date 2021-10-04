import { BuildingColor } from './building-color';

export const BuildingEgypt = {
  防: ['消', '维', '警', '医院'],
  防护: ['消防局', '维修所', '警察局', '医院'],
  普通住宅需求: {
    商业: [
      '粮食货摊',
      '蔬菜货摊',
      '水果货摊',
      '生肉货摊',
      '鱼虾货摊',
      '陶器货摊',
      '亚麻布货摊',
      '啤酒货摊',
    ],
    市政: ['蓄水池', '法院'],
    文化: ['杂耍乐园', '宴乐馆'],
    宗教: ['沙暴神殿', '冥神殿'],
  },
  高级住宅需求: {
    商业: [
      '粮食货摊',
      '蔬菜货摊',
      '水果货摊',
      '生肉货摊',
      '鱼虾货摊',
      '陶器货摊',
      '亚麻布货摊',
      '啤酒货摊',
      '莎草纸货摊',
      '染料货摊',
    ],
    市政: ['蓄水池', '法院'],
    文化: ['杂耍乐园', '浴池', '宴乐馆', '竞技场', '大学'],
    宗教: ['丰饶神殿', '太阳神殿'],
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
      background: BuildingColor['住宅'][0],
    },
  ],
  农业: [
    {
      name: '谷物田',
      text: '谷物田',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][0],
    },
    {
      name: '莴苣田',
      text: '莴苣田',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][1],
    },
    {
      name: '无花果园',
      text: '无花果园',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][2],
    },
    {
      name: '猎人小屋',
      text: '猎人',
      size: 2,
      range: 0,
      background: BuildingColor['农业'][3],
    },
    {
      name: '亚麻田',
      text: '亚麻田',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][4],
    },
    {
      name: '大麦田',
      text: '大麦田',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][5],
    },
    {
      name: '纸莎草',
      text: '纸莎草',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][6],
    },
    {
      name: '指甲花',
      text: '指甲花',
      size: 3,
      range: 0,
      background: BuildingColor['农业'][7],
    },
  ],
  工业: [
    {
      name: '炼铜场',
      text: '炼铜场',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][0],
    },
    {
      name: '木乃伊',
      text: '木乃伊',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][1],
    },
    {
      name: '陶器场',
      text: '陶器场',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][2],
    },
    {
      name: '纺织厂',
      text: '纺织厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][3],
    },
    {
      name: '啤酒厂',
      text: '啤酒厂',
      size: 3,
      range: 0,
      background: BuildingColor['工业'][4],
    },
    {
      name: '造纸厂',
      text: '造纸厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][5],
    },
    {
      name: '染料厂',
      text: '染料厂',
      size: 2,
      range: 0,
      background: BuildingColor['工业'][6],
    },
  ],
  商业: [
    {
      name: '粮食货摊',
      text: '粮',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][0],
    },
    {
      name: '蔬菜货摊',
      text: '菜',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][1],
    },
    {
      name: '水果货摊',
      text: '果',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][2],
    },
    {
      name: '生肉货摊',
      text: '肉',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][3],
    },
    {
      name: '鱼虾货摊',
      text: '鱼',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][4],
    },
    {
      name: '陶器货摊',
      text: '陶',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][5],
    },
    {
      name: '亚麻布货摊',
      text: '布',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][6],
    },
    {
      name: '啤酒货摊',
      text: '酒',
      size: 1,
      range: 5,
      background: BuildingColor['商业'][7],
    },
    {
      name: '莎草纸货摊',
      text: '莎',
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
  ],
  市政: [
    {
      name: '蓄水池',
      text: '水',
      size: 1,
      range: 4,
      background: BuildingColor['市政']['水'],
    },
    {
      name: '消防局',
      text: '消',
      size: 1,
      range: 6,
      background: BuildingColor['市政']['防'],
    },
    {
      name: '维修所',
      text: '维',
      size: 1,
      range: 6,
      background: BuildingColor['市政']['防'],
    },
    {
      name: '警察局',
      text: '警',
      size: 1,
      range: 7,
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
      size: 4,
      range: 0,
      background: BuildingColor['市政']['货'],
    },
    {
      name: '宫殿',
      text: '宫殿',
      size: 5,
      range: 0,
      background: BuildingColor['市政']['殿'],
    },
    {
      name: '法院',
      text: '法院',
      size: 3,
      range: 6,
      background: BuildingColor['市政']['职'],
    },
    {
      name: '贸易站',
      text: '贸易站',
      size: 2,
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
      name: '水力磨坊',
      text: '磨坊',
      size: 2,
      range: 4,
      background: BuildingColor['市政']['磨'],
    },
    {
      name: '浇灌水车',
      text: '水车',
      size: 2,
      range: 4,
      background: BuildingColor['市政']['浇'],
    },
  ],
  文化: [
    {
      name: '杂耍乐园',
      text: '杂耍',
      size: 2,
      range: 7,
      background: BuildingColor['文化'][0],
    },
    {
      name: '浴池',
      text: '浴池',
      size: 3,
      range: 8,
      background: BuildingColor['文化'][1],
    },
    {
      name: '宴乐馆',
      text: '宴乐馆',
      size: 4,
      range: 8,
      background: BuildingColor['文化'][2],
    },
    {
      name: '竞技场',
      text: '竞技场',
      size: 4,
      range: 9,
      background: BuildingColor['文化'][3],
    },
    {
      name: '大学',
      text: '大学',
      size: 4,
      range: 10,
      background: BuildingColor['文化'][4],
    },
  ],
  宗教: [
    {
      name: '沙暴神殿',
      text: '沙',
      size: 1,
      range: 5,
      background: BuildingColor['宗教'][0],
    },
    {
      name: '冥神殿',
      text: '冥神殿',
      size: 2,
      range: 6,
      background: BuildingColor['宗教'][1],
    },
    {
      name: '丰饶神殿',
      text: '丰饶神殿',
      size: 3,
      range: 8,
      background: BuildingColor['宗教'][2],
    },
    {
      name: '太阳神殿',
      text: '太阳神殿',
      size: 6,
      range: 10,
      background: BuildingColor['宗教'][3],
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
      name: '武器铺',
      text: '武器铺',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][1],
    },
    {
      name: '弓兵兵营',
      text: '弓兵',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][2],
    },
    {
      name: '木乃伊祭坛',
      text: '祭坛',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][3],
    },
    {
      name: '阿努比斯',
      text: '阿努',
      size: 2,
      range: 0,
      background: BuildingColor['军事'][4],
    },
    {
      name: '荷鲁斯',
      text: '荷鲁斯',
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
      name: '小金子塔',
      text: '小金子塔',
      size: 8,
      range: 0,
      background: BuildingColor['奇迹'][0],
    },
    {
      name: '狮身人面像',
      text: '狮身人面像',
      size: 8,
      range: 0,
      background: BuildingColor['奇迹'][1],
    },
    {
      name: '阿布辛贝神庙',
      text: '阿布辛贝神庙',
      size: 10,
      range: 0,
      background: BuildingColor['奇迹'][2],
    },
    {
      name: '亚历山大灯塔',
      text: '亚历山大灯塔',
      size: 10,
      range: 0,
      background: BuildingColor['奇迹'][3],
    },
    {
      name: '亚历山大图书馆',
      text: '亚历山大图书馆',
      size: 13,
      range: 0,
      background: BuildingColor['奇迹'][4],
    },
    {
      name: '大金字塔',
      text: '大金字塔',
      size: 15,
      range: 0,
      background: BuildingColor['奇迹'][5],
    },
  ],
};