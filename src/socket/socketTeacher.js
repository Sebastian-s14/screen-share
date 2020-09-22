import io from "socket.io-client";

export const socketTeacher = io("localhost:8086/teacher");
