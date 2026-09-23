const Alert = ({ type, message, className = '' }) => {
  return (
    <div className={`alert alert-${type} fade show ${className}`.trim()} role="alert">
      {message}
    </div>
  );
};

export default Alert;
