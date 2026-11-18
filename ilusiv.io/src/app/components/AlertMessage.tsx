// A line of error text. Field errors are tied to their field by id; only an
// error with no field of its own is announced as an alert.
const AlertMessage = ({
  id,
  message,
  announce = false,
}: {
  id?: string;
  message: string;
  announce?: boolean;
}) => (
  <p
    id={id}
    role={announce ? "alert" : undefined}
    className="mt-2 text-sm font-normal text-red-600 dark:text-red-400"
  >
    {message}
  </p>
);

export default AlertMessage;
