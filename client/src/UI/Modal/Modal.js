import React, { memo } from 'react';

const modal = (props) => (
    <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">

        </div>
    </div>
)

export default memo(modal);