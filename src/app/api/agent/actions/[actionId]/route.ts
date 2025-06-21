import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ actionId: string }> }
) {
  try {
    const { actionId } = await params;
    const body = await request.json();
    const { action } = body; // 'approve' or 'reject'

    if (!actionId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing actionId or action' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Validate the action exists
    // 2. Check user permissions
    // 3. Update the action status in the database
    // 4. Execute the action if approved
    // 5. Notify relevant systems

    if (action === 'approve') {
      // Execute the action
      console.log(`Approving and executing action: ${actionId}`);
      
      // Update action status to approved/executed
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agent/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId,
          status: 'approved'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update action status');
      }

      return NextResponse.json({
        success: true,
        message: 'Action approved and executed'
      });
    } else if (action === 'reject') {
      console.log(`Rejecting action: ${actionId}`);
      
      // Update action status to rejected
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agent/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId,
          status: 'rejected'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update action status');
      }

      return NextResponse.json({
        success: true,
        message: 'Action rejected'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to process action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
