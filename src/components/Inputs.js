import { ForwardedRef, forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  return (
    <div className="mb-3 ">
      <label htmlFor={props.name} className="form-label input-text-transition" style={{ fontSize: 20, color: "#00000090", fontWeight: 400 }}>
        {props.title}
      </label>
      <div className="">
        <input
          style={{ color: "#00224C", border: "2px solid #00000060", borderRadius: 8, height: 40, fontSize: 18, width: 250 }}
          type={props.type}
          className={props.className}
          ref={ref}
          id={props.name}
          autoComplete={props.autoComplete}
          onChange={props.onChange}
          defaultValue={props.value}
        />
      </div>
    </div>
  );
});

export default Input;
