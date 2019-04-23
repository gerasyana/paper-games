import React, { memo } from 'react';

const gameRating = (props) => {
    const rating = props.rating.map(ratingItem => (
        <tr key={ratingItem.username}>
            <td>{ratingItem.username}</td>
            <td>{ratingItem.points}</td>
        </tr>
    ));

    return (
        <div>
            <h4>Game rating : </h4> <br />
            <div className="table-responsive" style={{ maxHeight: "350px", overflow: "scroll" }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Total points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rating}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default memo(gameRating);