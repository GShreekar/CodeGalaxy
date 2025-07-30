const Alert = ({ type, message }) => {
  return (
    <div className={`alert alert-${type} fade show`} role="alert">
      {message}
    </div>
  );
};