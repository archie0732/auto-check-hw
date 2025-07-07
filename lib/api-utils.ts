import { NextRequest } from 'next/server';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): Response {
  const response: APIResponse<T> = {
    success: true,
    data,
    message
  };
  
  return Response.json(response, { status: 200 });
}

export function createErrorResponse(error: string, status: number = 500): Response {
  const response: APIResponse = {
    success: false,
    error
  };
  
  return Response.json(response, { status });
}

export function createNotFoundResponse(message: string = 'Resource not found'): Response {
  return createErrorResponse(message, 404);
}

export function createBadRequestResponse(message: string = 'Bad request'): Response {
  return createErrorResponse(message, 400);
}

export function createInternalErrorResponse(error: unknown): Response {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  console.error('API Error:', error);
  return createErrorResponse(errorMessage, 500);
}

// 安全的 JSON 解析
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

// 驗證環境變數
export function validateEnvVars(requiredVars: string[]): string[] {
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  return missing;
}

// 安全的請求處理包裝器
export function withErrorHandling<T>(
  handler: (req: NextRequest) => Promise<T>
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const result = await handler(req);
      return createSuccessResponse(result);
    } catch (error) {
      return createInternalErrorResponse(error);
    }
  };
} 