"use client";

import { ContactForm, FormData } from "../components/ContactForm";

const Contact = () => {
  const onSubmit = async (data: FormData) => {
    const res = await fetch("api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status >= 400) {
      const json = await res.json();
      console.error("Error sending email");
      console.error(json);
    }
  };

  return (
    <main>
      <div className="flex justify-center">
        <div className="flex justify-center pt-16 pb-24 px-8 sm:w-4/5 md:w-3/4 lg:w-1/2 2xl:w-2/5">
          <ContactForm onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  );
};

export default Contact;
