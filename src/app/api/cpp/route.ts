import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

interface CppRequestBody {
  key: string;
  code: string;
  input: string;
}

interface PistonResponse {
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { key, code, input } = (await req.json()) as CppRequestBody;

    if (!key || !code || !input) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await runCpp(code, input);

    if (result.run.stderr) {
      return NextResponse.json({ error: 'Compilation or runtime error', stderr: result.run.stderr }, { status: 400 });
    }

    return NextResponse.json({ userans: result.run.stdout.trim() });
  }
  catch (error) {
    console.error('Error executing C++ code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
  catch {
    throw new Error('Error communicating with Piston API');
  }
}
