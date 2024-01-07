export const ShowAlert = (setAlertClassName, setAlertMessage, message, className, timeout = 5000) => {

    setAlertMessage(message);
    setAlertClassName(className);

    setTimeout(() => {
        setAlertMessage("");
        setAlertClassName("");
    }, timeout);
};