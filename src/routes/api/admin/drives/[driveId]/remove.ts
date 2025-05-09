import { requireAuth } from "@/helpers/auth";
import { removeUserDrive, getUserDrive } from "@/models/user-drive";

export const DELETE = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params: { driveId: string },
) => {
  try {
    const user = await requireAuth(request, env);
    const { driveId } = params;

    // Get user drive
    const userDrive = await getUserDrive(env, driveId);
    if (!userDrive || userDrive.user_email !== user.email) {
      return new Response(JSON.stringify({ error: "Drive not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Remove drive
    await removeUserDrive(env, driveId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
