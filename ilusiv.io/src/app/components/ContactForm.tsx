import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage";
import IlusivH1 from "./IlusivH1";
import { useState } from "react";

export type FormData = {
  name: string;
  email: string;
  subject: "project" | "question";
  message: string;
};

export const ContactForm = ({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [hasSentMessage, setHasSentMessage] = useState(false);

  const onFormSubmit = async (data: FormData) => {
    setHasSentMessage(true);
    onSubmit(data);
  };

  return (
    <>
      {hasSentMessage ? (
        <div className="w-full">
          <IlusivH1>{"Thanks for reaching out."}</IlusivH1>
          <p>
            {
              "I appreciate you for thinking of me. While I try to respond to every inquiry in a timely manner, sometimes life get's in the way. And let's be honest, spam happens. Still, I hope we talk soon."
            }
          </p>
        </div>
      ) : (
        <div className="w-full">
          <IlusivH1>{"What's on you're mind?"}</IlusivH1>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <input
              className="w-full rounded-md my-2 p-2 bg-gray-50"
              {...register("name", { required: true })}
              placeholder="Your name"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <AlertMessage message="Please enter your name" />}
            <input
              className="w-full rounded-md my-2 p-2 bg-gray-50"
              {...register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              placeholder="Your email address"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <AlertMessage message="Please enter a valid email address" />
            )}
            <select
              className="w-full rounded-md my-2 p-2 bg-gray-50"
              {...register("subject", { required: true })}
            >
              <option value="">Choose a Topic</option>
              <option value="project">I have a project</option>
              <option value="question">I have a question</option>
            </select>
            {errors.subject && <AlertMessage message="Please select a topic" />}
            <textarea
              className="w-full min-h-60 rounded-md my-2 p-2 bg-gray-50"
              {...register("message", {
                required: true,
                minLength: 50,
                maxLength: 2500,
              })}
              placeholder="Tell me..."
            />
            {errors.message?.type === "required" && (
              <AlertMessage message="Don't forget to write a message :)" />
            )}
            {errors.message?.type === "minLength" && (
              <AlertMessage message="A little more detail, please" />
            )}
            {errors.message?.type === "maxLength" && (
              <AlertMessage message="Let's keep things short at first, if you don't mind" />
            )}
            <div className="flex flex-row-reverse">
              <input
                className="my-4 py-2 px-8 rounded-md font-medium bg-accent opacity-70 hover:opacity-100 cursor-pointer text-white transition-opacity"
                type="submit"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
