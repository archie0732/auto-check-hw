import axios from 'axios';
import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createInternalErrorResponse 
} from '@/lib/api-utils';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

interface CppRequestBody {
  key: string;
  code: string;
  input: string;
}

export interface PistonResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: null | string;
    output: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { key, code, input } = (await req.json()) as CppRequestBody;

    if (!key || !code || !input) {
      return createBadRequestResponse('Missing required fields');
    }

    const result = await runCpp(code, input);

    if (result.run.stderr) {
      return createSuccessResponse({
        error: 'Compilation or runtime error',
        stderr: result.run.stderr
      });
    }

    return createSuccessResponse({
      userans: result.run.stdout.trim()
    });
  }
  catch (error) {
    return createInternalErrorResponse(error);
  }
}

async function runCpp(code: string, input: string): Promise<PistonResponse> {
  try {
    const res = await axios.post<PistonResponse>(PISTON_API, {
      language: 'cpp',
      version: '10.2.0',
      files: [{ content: code }],
      stdin: input,
    });

    return res.data;
  }
  catch (error) {
    throw new Error('Error communicating with Piston API');
  }
}


export interface RunCodeResponse {
  success: boolean;
  data: {
    userans: string;
  }
}