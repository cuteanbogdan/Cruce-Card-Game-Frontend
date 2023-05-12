import React from 'react';

const Game = ({ game, joinGame }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Game #{game._id}</div>
                <p className="text-gray-700 text-base">
                    Players: {game.players.length}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <button onClick={() => joinGame(game._id)}
                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Join
                </button>
            </div>
        </div>
    );
};

export default Game;
