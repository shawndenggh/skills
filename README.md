# Shawn Deng's Personal Skills

个人 AI Skills 集合，用来沉淀可复用的工作流、领域知识和自动化能力。

这些 Skills 主要服务于我的个人开发、运维、写作和日常工作，也可以作为其他 AI Agent 的参考或直接使用。

## Repository Structure

```text
.
├── skills/              # 可直接使用的 Skills
│   └── <skill-name>/
│       ├── SKILL.md     # Skill 的核心说明，必需
│       ├── agents/      # 可选：Agent UI 元数据
│       ├── scripts/     # 可选：可重复执行的脚本
│       ├── references/  # 可选：按需加载的参考资料
│       └── assets/      # 可选：模板、图片等资源
└── templates/           # 创建新 Skill 时使用的模板
```

## Available Skills

Skills 正在持续整理中，后续会按用途分类，例如：

- Development：开发与代码审查
- DevOps：部署、诊断与运维
- Writing：写作、编辑与内容发布
- Productivity：个人效率与自动化
- Domain：项目或业务领域知识

## How to Add a Skill

1. 在 `skills/` 下创建一个使用小写字母、数字和连字符的目录。
2. 添加必需的 `SKILL.md`，并在 YAML frontmatter 中声明 `name` 和 `description`。
3. 只放入完成任务真正需要的说明、脚本和参考资料，避免重复基础知识。
4. 将复杂或低频内容放进 `references/`，在 `SKILL.md` 中按需引用。
5. 在真实任务中验证 Skill，再提交变更。

示例：

```text
skills/
└── example-skill/
    └── SKILL.md
```

## Skill Design Principles

- **简洁**：节省 Agent 上下文，只记录必要信息。
- **可执行**：优先描述明确的步骤、判断条件和验证方式。
- **渐进披露**：核心流程放在 `SKILL.md`，详细资料按需加载。
- **可复用**：把个人经验整理成稳定、可迁移的工作流。
- **安全优先**：涉及外部发布、数据删除或生产环境变更时，明确确认和回滚边界。

## License

除特别声明外，本仓库内容采用 [MIT License](LICENSE)。
