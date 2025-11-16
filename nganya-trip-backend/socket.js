// socket.js
function setupSocket(server) {
    const io = require("socket.io")(server, { cors: { origin: "*" } });

    io.on("connection", socket => {
        console.log("Socket connected:", socket.id);

        // DRIVER JOIN ROOM
        socket.on("joinDriver", driverId => {
            console.log(`Driver ${driverId} joined room`);
            socket.join(driverId);
        });

        // PASSENGER JOIN ROOM
        socket.on("joinPassenger", passengerId => {
            console.log(`Passenger ${passengerId} joined room`);
            socket.join(passengerId);
        });

        // PASSENGER GPS → Driver
        socket.on("passengerGPS", data => {
            io.to(data.driverId).emit("passengerGPS", data);
        });

        // DRIVER GPS → Passenger
        socket.on("driverGPSStage", data => {
            io.to(data.passengerId).emit("driverGPSStage", data);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = { setupSocket };
