// GitHub API 使用範例

// 1. 更新檔案
async function updateFileExample() {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'updateFile',
      path: 'data/example.txt',
      content: '這是機器人自動更新的內容',
      message: 'feat: 自動更新檔案',
      branch: 'main'
    })
  });
  
  const result = await response.json();
  console.log('更新檔案結果:', result);
}

// 2. 獲取檔案內容
async function getFileExample() {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getFile',
      path: 'README.md',
      branch: 'main'
    })
  });
  
  const result = await response.json();
  console.log('檔案內容:', result);
}

// 3. 創建新分支
async function createBranchExample() {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'createBranch',
      path: 'feature/auto-update',
      branch: 'main'
    })
  });
  
  const result = await response.json();
  console.log('創建分支結果:', result);
}

// 4. 獲取 repository 資訊
async function getRepoInfoExample() {
  const response = await fetch('/api/github');
  const result = await response.json();
  console.log('Repository 資訊:', result);
}

// 使用範例
export async function runExamples() {
  try {
    console.log('=== GitHub API 使用範例 ===');
    
    // 獲取 repository 資訊
    await getRepoInfoExample();
    
    // 更新檔案
    await updateFileExample();
    
    // 獲取檔案內容
    await getFileExample();
    
    // 創建新分支
    await createBranchExample();
    
  } catch (error) {
    console.error('範例執行錯誤:', error);
  }
} 