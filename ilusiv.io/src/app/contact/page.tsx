import ContactForm from "../components/ContactForm";

export type FormData = {
  name: string;
  email: string;
  subject: "project" | "question";
  message: string;
};

const Contact = () => {
  return (
    <main>
      <div className="flex justify-center">
        <div className="pt-16 pb-24 px-8 sm:w-4/5 md:w-3/4 lg:w-1/2 2xl:w-2/5">
          <ContactForm />
        </div>
      </div>
    </main>
  );
};

export default Contact;
