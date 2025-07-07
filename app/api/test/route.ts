import { createSuccessResponse } from "@/lib/api-utils";

export const GET = async () => {
  return createSuccessResponse({ test_message: 'success!' });
}