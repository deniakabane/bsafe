import { NextResponse } from "next/server";

const response = (
  statusCode = 200,
  success = false,
  message = "",
  data = {},
  pagination = {}
) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
      ...pagination,
    },
    { status: statusCode }
  );
};

export default response;
