# GitHub Token 安全設定指南

## 🔐 安全注意事項

### 1. Token 權限最小化
- 只給予必要的權限
- 對於公開 repository，使用 `public_repo` 權限即可
- 對於私有 repository，使用 `repo` 權限

### 2. Token 過期設定
- 設定適當的過期時間
- 定期更新 token
- 監控 token 使用情況

### 3. 環境變數安全
- 永遠不要將 token 提交到版本控制
- 使用 `.env.local` 檔案（已被 .gitignore 忽略）
- 在生產環境中使用安全的環境變數管理

### 4. 網路安全
- 使用 HTTPS 連接
- 避免在不安全的網路環境中使用
- 定期檢查 token 的使用記錄

## 🛡️ 最佳實踐

### 1. 創建專用帳戶
考慮為機器人創建一個專用的 GitHub 帳戶，而不是使用個人帳戶。

### 2. 使用 GitHub Apps
對於更複雜的整合，考慮使用 GitHub Apps 而不是 Personal Access Token。

### 3. 監控和日誌
- 記錄所有 API 調用
- 監控異常活動
- 設定警報機制

### 4. 定期審查
- 定期檢查 token 權限
- 移除不再使用的 token
- 更新過期的 token

## 🚨 緊急處理

如果 token 洩露：
1. 立即在 GitHub 設定中撤銷 token
2. 檢查是否有未授權的活動
3. 創建新的 token
4. 更新所有使用該 token 的系統
5. 調查洩露原因並修復

## 📋 檢查清單

- [ ] Token 權限設定正確
- [ ] Token 有適當的過期時間
- [ ] 環境變數檔案已加入 .gitignore
- [ ] 生產環境使用安全的環境變數管理
- [ ] 監控機制已設定
- [ ] 緊急處理流程已準備 