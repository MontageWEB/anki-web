# Anki 复习助手 API 文档

## 基础信息
- 基础路径: `/api/v1`
- 响应格式: JSON
- 时间格式: ISO 8601 (例如: "2024-05-12T10:30:00Z")
- 服务地址: http://localhost:8001

## 错误响应
所有接口的错误响应格式统一为：
```json
{
    "detail": "错误信息"
}
```

## 认证与多用户说明
- 除认证接口外，所有卡片和复习规则相关接口均需在请求头携带 `Authorization: Bearer <token>`
- 所有数据均归属于当前登录用户，接口操作仅影响自己的数据，互不干扰

## 接口列表


### 0. 用户认证

#### 0.1 微信一键登录
- 路径: POST `/auth/wx-login`
- 请求体:
```json
{
  "code": "微信登录临时凭证",
  "nickname": "微信昵称",
  "avatar": "微信头像url"
}
```
- 响应体:
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```
- 说明: 前端传 code，后端换取 openid 并返回 token

### 1. 知识卡片管理

#### 1.1 创建卡片
- 路径: POST `/cards`
- 描述: 创建新的知识卡片
- 请求体:
```json
{
    "question": "知识点/问题，最多100字",
    "answer": "答案/解释，最多500字，支持富文本"
}
```
- 响应:
```json
{
    "id": 1,
    "question": "知识点",
    "answer": "答案",
    "review_count": 0,
    "next_review_at": "2024-05-12T10:30:00Z",
    "created_at": "2024-05-12T10:30:00Z",
    "updated_at": "2024-05-12T10:30:00Z"
}
```

#### 1.2 获取卡片列表
- 路径: GET `/cards`
- 描述: 获取所有卡片，支持分页和搜索
- 查询参数:
  - `page`: 页码，默认 1
  - `per_page`: 每页数量，默认 20，最大 100
  - `search`: 搜索关键词（可选）
- 响应:
```json
{
    "total": 100,
    "page": 1,
    "per_page": 20,
    "items": [
        {
            "id": 1,
            "question": "知识点",
            "answer": "答案",
            "review_count": 0,
            "next_review_at": "2024-05-12T10:30:00Z",
            "created_at": "2024-05-12T10:30:00Z",
            "updated_at": "2024-05-12T10:30:00Z"
        }
    ]
}
```

#### 1.3 获取卡片详情
- 路径: GET `/cards/{card_id}`
- 描述: 获取单个卡片的详细信息
- 响应: 同创建卡片的响应

#### 1.4 更新卡片
- 路径: PUT `/cards/{card_id}`
- 描述: 更新卡片内容
- 请求体:
```json
{
    "question": "知识点/问题，最多100字",
    "answer": "答案/解释，最多500字，支持富文本"
}
```
- 响应: 同创建卡片的响应

#### 1.5 删除卡片
- 路径: DELETE `/cards/{card_id}`
- 描述: 删除指定卡片
- 响应: HTTP 204 No Content

### 2. 复习功能

#### 2.1 获取待复习卡片
- 路径: GET `/cards/review`
- 描述: 获取需要复习的卡片列表
- 查询参数:
  - `page`: 页码，默认 1
  - `per_page`: 每页数量，默认 20，最大 100
- 响应: 同获取卡片列表的响应

#### 2.2 更新复习状态
- 路径: POST `/cards/{card_id}/review`
- 描述: 更新卡片的复习状态
- 请求体:
```json
{
    "remembered": true  // true: 记住了，false: 忘记了
}
```
- 响应: 同创建卡片的响应

#### 2.3 修改下次复习日期
- 路径: PUT `/cards/{card_id}/next-review`
- 描述: 手动修改卡片的下次复习日期，不影响复习次数和复习规则
- 请求体:
```json
{
    "next_review_at": "2024-05-12T10:30:00Z"  // ISO 8601 格式的日期时间
}
```
- 响应: 同创建卡片的响应

### 3. 复习规则管理

#### 3.1 获取复习规则列表
- 路径: GET `/review-rules`
- 描述: 获取所有复习规则，按复习次数排序
- 响应:
```json
{
    "items": [
        {
            "id": 1,
            "review_count": 1,
            "interval_days": 1,
            "created_at": "2024-05-12T10:30:00Z",
            "updated_at": "2024-05-12T10:30:00Z"
        }
    ]
}
```

#### 3.2 批量更新复习规则
- 路径: PUT `/review-rules`
- 描述: 批量更新复习规则
- 请求体:
```json
{
    "rules": [
        {
            "review_count": 1,
            "interval_days": 1
        },
        {
            "review_count": 2,
            "interval_days": 2
        }
    ]
}
```
- 响应: 同获取规则列表的响应

#### 3.3 重置复习规则
- 路径: POST `/review-rules/reset`
- 描述: 重置复习规则为默认值
- 响应: 同获取规则列表的响应
