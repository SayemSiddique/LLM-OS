import { NextRequest, NextResponse } from 'next/server';
import { AgentAction, AgentActionType, AutonomyLevel } from '../../../../types';

// In a real implementation, this would connect to a database
let pendingActions: AgentAction[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const status = searchParams.get('status');

    let filteredActions = pendingActions;

    if (sessionId) {
      filteredActions = filteredActions.filter(action => action.sessionId === sessionId);
    }

    if (status) {
      filteredActions = filteredActions.filter(action => action.status === status);
    }

    return NextResponse.json({
      success: true,
      actions: filteredActions
    });
  } catch (error) {
    console.error('Failed to fetch actions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch actions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, type, description, payload, autonomyLevel } = body;

    if (!sessionId || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const action: AgentAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: type as AgentActionType,
      description,
      payload,
      status: 'pending',
      autonomyLevel: autonomyLevel || AutonomyLevel.EXECUTE_WITH_APPROVAL,
      timestamp: new Date(),
    };

    pendingActions.push(action);

    return NextResponse.json({
      success: true,
      action
    });
  } catch (error) {
    console.error('Failed to create action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create action' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, status, result, error } = body;

    if (!actionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing actionId or status' },
        { status: 400 }
      );
    }

    const actionIndex = pendingActions.findIndex(action => action.id === actionId);

    if (actionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Action not found' },
        { status: 404 }
      );
    }

    pendingActions[actionIndex] = {
      ...pendingActions[actionIndex],
      status,
      executedAt: status === 'executed' || status === 'failed' ? new Date() : undefined,
      result,
      error,
    };

    return NextResponse.json({
      success: true,
      action: pendingActions[actionIndex]
    });
  } catch (error) {
    console.error('Failed to update action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update action' },
      { status: 500 }
    );
  }
}
