import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
   
    return NextResponse.json({
      status: 200,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json({
      status: 500,
      message: "Error",
    });
  }
};
