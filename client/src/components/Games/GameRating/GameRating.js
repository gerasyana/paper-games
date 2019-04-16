import React from 'react';

const gameRating = (props) => {
    return (
        <div>
            <h4>Today's game rating : </h4> <br/>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Total points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mark</td>
                            <td>100</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default gameRating