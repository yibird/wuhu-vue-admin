# Workflow DSL 0.0.1

## 设计目标

Workflow DSL 是编辑器、校验器、编译器和运行时之间的稳定契约。DSL 只保存可执行语义和必要元数据；Vue Flow 坐标放在 `ui`，第三方实例和运行时状态不得写入 DSL。

当前版本为 `0.0.1`，Schema 地址为：

```text
https://wuhu.dev/schemas/workflow/0.0.1/schema.json
```

## 顶层结构

| 字段                       | 作用                                           |
| -------------------------- | ---------------------------------------------- |
| `$schema` / `dslVersion`   | Schema 地址与 DSL 协议版本                     |
| `id` / `key` / `namespace` | 实例标识、稳定业务键和命名空间                 |
| `version` / `revision`     | 发布版本和草稿修订号                           |
| `status`                   | `draft`、`published`、`deprecated`、`archived` |
| `entrypoint`               | 当前工作流唯一开始节点 ID                      |
| `triggers`                 | 手动、API、Webhook、定时和事件触发配置         |
| `interface`                | 工作流输入、输出的类型契约                     |
| `variables`                | 工作流、环境和 Secret 变量声明                 |
| `resources`                | 模型、知识库、数据库、凭证等资源引用           |
| `permissions`              | owner、editor、runner、viewer 权限主体         |
| `policies`                 | 超时、重试、并发、幂等和失败策略               |
| `deployment`               | 环境、发布策略和发布审批要求                   |
| `observability`            | 日志级别、链路、指标、留存和脱敏规则           |
| `nodes` / `edges`          | 节点实例和权威拓扑                             |
| `ui`                       | 编辑器位置、折叠状态和视口，不参与执行         |
| `extensions`               | 带命名空间的兼容扩展，禁止覆盖标准字段         |

## 节点 Schema

```json
{
  "id": "llm-1",
  "type": "llm",
  "version": "0.0.1",
  "name": "生成答复",
  "description": "根据问题和上下文生成答复",
  "disabled": false,
  "config": {},
  "inputBindings": {},
  "next": ["end"],
  "prev": ["knowledge"],
  "runtime": {
    "timeoutMs": 30000,
    "continueOnError": false
  },
  "metadata": {}
}
```

节点定义与节点实例必须分离：

- Registry 描述节点类型、版本、端口、配置 Schema、默认值和执行能力。
- DSL Node 只保存该节点实例的配置、输入绑定、运行策略和元数据。
- 未注册的 `type` 或不支持的节点 `version` 必须在编译前拒绝。

## 拓扑规则

`edges` 是唯一拓扑真相源。`next` 和 `prev` 是为了查询、审计和后端索引而生成的邻接缓存：

- `next` 由当前节点所有出边的 `target` 去重生成。
- `prev` 由当前节点所有入边的 `source` 去重生成。
- 编辑器连线、删线或删节点后必须重新生成这两个字段。
- 导入 DSL 时，校验器会拒绝与 `edges` 不一致的索引。
- 编译器不得仅依赖 `next` / `prev` 生成执行计划。

Edge 使用端口表达数据流：

```json
{
  "id": "edge-knowledge-llm",
  "source": "knowledge",
  "target": "llm",
  "sourcePort": "chunks",
  "targetPort": "context",
  "kind": "flow",
  "priority": 0
}
```

输入端口默认只允许一条连线。Registry 端口显式声明 `multiple: true` 后才允许多条连线。

## 数据绑定

`inputBindings` 支持六种来源：

- `literal`: JSON 字面量。
- `workflow-input`: 工作流接口输入。
- `variable`: 已声明变量。
- `node-output`: 上游节点与输出端口。
- `expression`: CEL 或 JSONata 表达式。
- `template`: 模板字符串。

Secret 只能声明引用，实际值由运行环境注入。DSL、日志、节点输出和浏览器状态都不得保存 Secret 明文。

## 编译管线

```text
Workflow DSL
  -> Parse
  -> Migrate / Normalize
  -> Validate
  -> Compile
  -> Execution Plan
  -> Runtime
  -> Node Executor
```

校验至少覆盖：身份和版本、节点与边唯一性、端口兼容、必填输入、配置类型、变量和资源引用、入口和输出、不可达节点、环路、拓扑索引一致性。

Execution Plan 是运行时 IR，包含步骤、阶段、依赖、下游、转换、资源和运行策略。运行时不应直接解释编辑器对象。

## 控制流

- If / Else、Switch：分支条件保存在 branch edge 的 `condition` 和 `priority`，运行时只激活命中的转换。
- Parallel：编译为 fork/join，配置完成策略和最大并发。
- Loop、Iterator：使用结构化子图作为循环体，不能依赖普通图环绕过 DAG 校验。
- Human Approval、Human Input：编译为可持久化暂停点，通过 checkpoint token 恢复。
- Sub Workflow：固定已发布版本或明确版本策略，运行时记录父子 run ID。

结构化循环体建议格式：

```json
{
  "body": {
    "entrypoint": "body-start",
    "nodes": [],
    "edges": []
  }
}
```

## 生命周期与兼容

- `revision` 用于可变草稿；每次保存递增。
- `version` 用于不可变发布物；发布后禁止原地修改。
- 新修改从已发布版本派生新的 draft revision。
- DSL 协议版本使用语义化版本；不兼容变更提升主版本。
- 读取旧版本时先运行显式 migration，再进行当前版本校验。
- Executor 按 `node.type + node.version` 解析，升级节点必须提供迁移策略。

## 生产边界

浏览器运行时只用于编辑器调试。生产执行必须由服务端负责资源解析、凭证注入、权限校验、幂等、并发控制、持久化、断点恢复、审计日志和任意代码隔离。
