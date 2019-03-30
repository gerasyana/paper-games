import React , {memo} from 'react';

const input = (props) => {
    let input = (
        <div className="form-group">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type}
                defaultValue={props.value}
                autoComplete='off'
                className="form-control"
                id={props.id}
                placeholder={props.placeholder}
                onInput={props.onChange} />
        </div>
    );

    if (Object.hasOwnProperty.call(props, 'isValid')) {
        let inputClasses = ['form-control'];
        inputClasses.push(props.isValid ? "is-valid" : " is-invalid");

        let message = null;
        if (!props.isValid) {
            message = <div className="invalid-feedback">{props.errorMessage}</div>;
        }
        input = (
            <div className="form-group">
                <label htmlFor={props.id}>{props.label}</label>
                <input
                    autoComplete='off'
                    defaultValue={props.value}
                    type={props.type}
                    className={inputClasses.join(' ')}
                    id={props.id}
                    placeholder={props.placeholder}
                    onInput={props.onChange}/>
                {message}
            </div>
        );
    }
    return input;
}

export default memo(input);