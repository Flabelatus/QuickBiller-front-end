const Alert = (props) => {
    return (
        <div className="col-md-6 offset-md-3 px-5">
            <div className={"alert mt-4 px-5 " + props.className} role="alert" style={{ boxShadow: '0 0 5px #d2d0d0', borderRadius: 16, border: '0px solid #00000000' }}>
                <h3 className="h5 text-center">{props.message}</h3>
            </div>
        </div>

    )
}

export default Alert;