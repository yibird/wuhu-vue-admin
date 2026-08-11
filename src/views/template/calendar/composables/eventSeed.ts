import { createAllDayEvent, createEvent } from '@dayflow/core'
import dayjs from 'dayjs'
import { createEventMeta } from './eventMeta'

export function createSeedEvents() {
  const now = dayjs()

  return [
    createEvent({
      id: 'planning',
      title: '冲刺规划会',
      description: '确认本周研发容量、需求拆分和交付节奏。',
      start: now.hour(9).minute(30).second(0).millisecond(0).toDate(),
      end: now.hour(10).minute(30).second(0).millisecond(0).toDate(),
      calendarId: 'product',
      meta: createEventMeta({
        owner: '产品组',
        location: '会议室 A / 飞书',
        priority: 'high',
      }),
    }),
    createEvent({
      id: 'review',
      title: '设计评审',
      description: '评审低代码设计器的组件属性面板和交互细节。',
      start: now
        .add(1, 'day')
        .hour(14)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      end: now
        .add(1, 'day')
        .hour(15)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      calendarId: 'team',
      meta: createEventMeta({
        owner: '设计组',
        location: '设计评审频道',
        priority: 'medium',
        status: 'tentative',
      }),
    }),
    createEvent({
      id: 'release',
      title: '发布检查点',
      description: '确认灰度范围、回滚方案和发布窗口。',
      start: now
        .add(2, 'day')
        .hour(11)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      end: now
        .add(2, 'day')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      calendarId: 'delivery',
      meta: createEventMeta({
        owner: '交付组',
        location: '发布作战室',
        priority: 'high',
      }),
    }),
    createEvent({
      id: 'customer-review',
      title: '客户复盘',
      description: '整理关键客户反馈，沉淀下个迭代的优先级。',
      start: now
        .add(3, 'day')
        .hour(16)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      end: now
        .add(3, 'day')
        .hour(17)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
      calendarId: 'team',
      meta: createEventMeta({
        owner: '运营组',
        location: '客户成功群',
        priority: 'medium',
      }),
    }),
    createAllDayEvent({
      id: 'conference',
      title: '产品共创日',
      description: '跨团队集中讨论产品体验和模板生态。',
      start: now.add(5, 'day').toDate(),
      calendarId: 'product',
      meta: createEventMeta({
        owner: '产品组',
        location: '总部 12F',
        priority: 'low',
      }),
    }),
  ]
}
