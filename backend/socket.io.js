import userModel from "./models/user.model.js"

export const sockethandler = (io) => {
    io.on('connection', (socket) => {
        socket.on('identity', async ({ userId }) => {
            try {
                await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id, isOnline: true
                }, { new: true })
            } catch (error) {
                console.log(error)
            }
        })
        socket.on('disconnect', async () => {
            try {
                await userModel.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null, isOnline: false
                }, { new: true })
            } catch (error) {
                console.log(error)
            }
        })
    })
}