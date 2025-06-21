import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ToolService } from '../../../../lib/tools/service';
import { AgentActionType, AutonomyLevel } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const operation = await request.json();
    const { path: filePath, content, operation: op, options = {} } = operation;

    if (!filePath || !op) {
      return NextResponse.json({ error: 'Path and operation are required' }, { status: 400 });
    }

    // Security validation
    const validation = ToolService.validateToolAccess(
      AgentActionType.FILE_WRITE, // Use most restrictive for safety
      AutonomyLevel.EXECUTE_WITH_APPROVAL, // Assume this level for now
      { path: filePath }
    );

    if (!validation.allowed) {
      return NextResponse.json({ error: validation.reason }, { status: 403 });
    }

    // Ensure we're working within a safe directory
    const safeBasePath = process.cwd();
    const absolutePath = path.resolve(safeBasePath, filePath);
    
    // Prevent directory traversal
    if (!absolutePath.startsWith(safeBasePath)) {
      return NextResponse.json({ error: 'Access denied: Path outside safe directory' }, { status: 403 });
    }

    let result;
    
    switch (op) {
      case 'read':
        try {
          const data = await fs.readFile(absolutePath, options.encoding || 'utf8');
          result = { data, size: data.length };
        } catch (error) {
          throw new Error(`Failed to read file: ${error}`);
        }
        break;

      case 'write':
        if (!content) {
          return NextResponse.json({ error: 'Content is required for write operation' }, { status: 400 });
        }
        try {
          // Create backup if requested
          if (options.backup) {
            try {
              const existingContent = await fs.readFile(absolutePath, 'utf8');
              await fs.writeFile(`${absolutePath}.backup`, existingContent);
            } catch {
              // File might not exist, ignore backup error
            }
          }
          
          // Ensure directory exists
          await fs.mkdir(path.dirname(absolutePath), { recursive: true });
          await fs.writeFile(absolutePath, content, options.encoding || 'utf8');
          result = { success: true, path: absolutePath };
        } catch (error) {
          throw new Error(`Failed to write file: ${error}`);
        }
        break;

      case 'delete':
        try {
          await fs.unlink(absolutePath);
          result = { success: true, path: absolutePath };
        } catch (error) {
          throw new Error(`Failed to delete file: ${error}`);
        }
        break;

      case 'list':
        try {
          const items = await fs.readdir(absolutePath, { withFileTypes: true });
          result = {
            items: items.map(item => ({
              name: item.name,
              type: item.isDirectory() ? 'directory' : 'file',
              path: path.join(filePath, item.name)
            }))
          };
        } catch (error) {
          throw new Error(`Failed to list directory: ${error}`);
        }
        break;

      case 'create':
        try {
          await fs.mkdir(absolutePath, { recursive: options.recursive || false });
          result = { success: true, path: absolutePath };
        } catch (error) {
          throw new Error(`Failed to create directory: ${error}`);
        }
        break;

      default:
        return NextResponse.json({ error: `Unsupported operation: ${op}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      operation: op,
      path: filePath,
      data: result
    });

  } catch (error) {
    console.error('Filesystem API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Filesystem operation failed' }, 
      { status: 500 }
    );
  }
}
