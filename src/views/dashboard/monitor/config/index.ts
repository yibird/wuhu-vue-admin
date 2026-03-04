import type { AppType, Status, SysInfoType, SysMonitorData } from '../components/types'

export const statusItems: Status[] = [
  {
    id: 'liquidChart-1',
    title: 'CPU',
    value: 4.88,
    description: '( 0.2 / 4 ) 核'
  },
  {
    id: 'liquidChart-2',
    title: '内存',
    value: 14.88,
    description: '1.04 GB / 7.38 GB'
  },
  {
    id: 'liquidChart-3',
    title: '负载',
    value: 1.7,
    description: '运行流畅'
  },
  {
    id: 'liquidChart-4',
    title: '磁盘',
    value: 24.56,
    description: '16.12 GB / 196.49 GB'
  }
]

export const sysInfoItems: SysInfoType[] = [
  {
    title: '主机名称',
    value: 'iZ8vbbyz2u3851c1bqee25Z'
  },
  {
    title: '发行版本',
    value: 'ubuntu'
  },
  {
    title: '内核版本',
    value: '5.15.0-92-generic'
  },
  {
    title: '系统类型',
    value: 'x86_64'
  },
  {
    title: '主机地址',
    value: '172.16.0.166'
  },
  {
    title: '启动时间',
    value: '2024-04-28 16:11:06'
  },
  {
    title: '运行时间',
    value: '212天 18小时 32分钟 11秒'
  }
]

export const appItems: AppType[] = [
  {
    id: 1,
    title: 'Redis',
    description: '高性能的开源键值数据库',
    icon: ''
  },
  {
    id: 2,
    title: 'Halo',
    description: '强大易用的开源建站工具',
    icon: ''
  },
  {
    id: 3,
    title: 'MaxKB',
    description: '基于 LLM 大语言模型的知识库问答系统',
    icon: ''
  },
  {
    id: 4,
    title: 'MeterSphere',
    description: '新一代的测试管理和接口测试工具',
    icon: ''
  },
  {
    id: 5,
    title: 'AList',
    description: '支持多存储的文件列表程序和私人网盘',
    icon: ''
  },
  {
    id: 6,
    title: 'Ollama',
    description: '本地运行 Llama 2、Mistral、Gemma 和其他大型语言模型',
    icon: ''
  }
]

export const monitorData: SysMonitorData[] = [
  {
    time: '2:00',
    value: 8
  },
  {
    time: '4:00',
    value: 9
  },
  {
    time: '6:00',
    value: 11
  },
  {
    time: '8:00',
    value: 14
  },
  {
    time: '10:00',
    value: 16
  },
  {
    time: '12:00',
    value: 17
  },
  {
    time: '14:00',
    value: 17
  },
  {
    time: '16:00',
    value: 16
  },
  {
    time: '18:00',
    value: 15
  }
]
