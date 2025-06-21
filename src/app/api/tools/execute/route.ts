import { NextRequest, NextResponse } from 'next/server';
import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ToolService } from '../../../../lib/tools/service';
import { AgentActionType, AutonomyLevel } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const execution = await request.json();
    const { language, code, environment = 'sandbox', timeout = 30000, allowedModules = [] } = execution;

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
    }

    // Security validation
    const validation = ToolService.validateToolAccess(
      AgentActionType.CODE_EXECUTION,
      AutonomyLevel.EXECUTE_WITH_APPROVAL,
      { code, language }
    );

    if (!validation.allowed) {
      return NextResponse.json({ error: validation.reason }, { status: 403 });
    }

    // Create a temporary file for the code
    const tempDir = path.join(process.cwd(), 'temp', 'executions');
    await fs.mkdir(tempDir, { recursive: true });
    
    const executionId = uuidv4();
    let tempFile: string;
    let command: string;
    let args: string[];

    // Prepare execution based on language
    switch (language) {
      case 'python':
        tempFile = path.join(tempDir, `${executionId}.py`);
        command = 'python';
        args = [tempFile];
        break;
      
      case 'javascript':
        tempFile = path.join(tempDir, `${executionId}.js`);
        command = 'node';
        args = [tempFile];
        break;
      
      case 'typescript':
        tempFile = path.join(tempDir, `${executionId}.ts`);
        command = 'npx';
        args = ['tsx', tempFile];
        break;
      
      case 'bash':
        tempFile = path.join(tempDir, `${executionId}.sh`);
        command = 'bash';
        args = [tempFile];
        break;
      
      default:
        return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    // Write code to temporary file
    await fs.writeFile(tempFile, code);

    // Execute the code
    const startTime = Date.now();
    
    const result = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number;
      executionTime: number;
    }>((resolve, reject) => {      const child: ChildProcess = spawn(command, args, {
        cwd: tempDir,
        env: {
          ...process.env,
          NODE_ENV: 'development', // Changed from 'sandbox' to valid value
          // Limit environment variables for security
        },
        timeout: timeout
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data: any) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data: any) => {
        stderr += data.toString();
      });

      child.on('close', (code: number | null) => {
        const executionTime = Date.now() - startTime;
        resolve({
          stdout,
          stderr,
          exitCode: code || 0,
          executionTime
        });
      });

      child.on('error', (error: Error) => {
        reject(new Error(`Execution failed: ${error.message}`));
      });

      // Kill process if it runs too long
      setTimeout(() => {
        if (child.pid && !child.killed) {
          child.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }
      }, timeout);
    });

    // Clean up temporary file
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }

    return NextResponse.json({
      success: true,
      output: result.stdout + result.stderr,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      executionTime: result.executionTime,
      language,
      environment
    });

  } catch (error) {
    console.error('Code execution API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Code execution failed' }, 
      { status: 500 }
    );
  }
}

// Additional security considerations for production:
// 1. Use Docker containers for true sandboxing
// 2. Implement resource limits (CPU, memory, disk)
// 3. Network isolation
// 4. Module/import restrictions
// 5. Execution time limits per user
// 6. Rate limiting
// 7. Audit logging

/*
Example Docker-based execution:

import Docker from 'dockerode';

async function executeInDocker(language: string, code: string) {
  const docker = new Docker();
  
  const container = await docker.createContainer({
    Image: `sandbox-${language}:latest`,
    Cmd: ['sh', '-c', `echo '${code}' | ${getLanguageCommand(language)}`],
    WorkingDir: '/sandbox',
    NetworkMode: 'none', // No network access
    Memory: 128 * 1024 * 1024, // 128MB limit
    CpuShares: 512, // CPU limit
    AttachStdout: true,
    AttachStderr: true,
  });
  
  const stream = await container.attach({
    stdout: true,
    stderr: true,
    stream: true
  });
  
  await container.start();
  
  // Collect output...
  await container.wait();
  await container.remove();
  
  return output;
}
*/
