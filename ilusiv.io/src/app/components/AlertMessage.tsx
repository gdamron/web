const AlertMessage = ({ message }: { message: string }) => {
  return (
    <p className="text-red-500 text-right text-xs" role="alert">
      {message}
    </p>
  );
};

export default AlertMessage;
