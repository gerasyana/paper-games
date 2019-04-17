export {
    checkAuthentication,
    setAuthTimeout,
    login,
    loginStart,
    loginSuccess,
    loginFailed,
    signUp,
    signUpStart,
    signUpSuccess,
    signUpFailed,
    logout,
    logoutSuccess,
    setLoginRedirectUrl,
    setUserTotalPoints
} from './auth'

export {
    updateRooms,
    setSiteStatistics,
    getGameRating,
    setGameRating
} from './statistics'

export {
    createRoom,
    joinRoom,
    player1Joined,
    player2Joined,
    closeRoom,
    leaveRoom,
    playerLeftRoom,
    togglePlayerTurn,
    playerMadeMove,
    gameIsOver,
    waitForPlayer,
    restartGame
} from './game'
