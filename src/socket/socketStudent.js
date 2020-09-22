import io from "socket.io-client";

export const socketStudent = io("localhost:8086/student");
