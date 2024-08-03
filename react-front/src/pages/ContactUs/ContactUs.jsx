const ContactUs = () => {
  return (
    <section className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto sm:my-5">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <div className="mb-2 flex gap-2 text-base font-semibold ">
        <span>Phone: 01881591572</span>
        <span>Email: jfdffjd@gmail.com</span>
      </div>
      <form action="" className="flex flex-col gap-3">
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Subject" />
        <input type="text" placeholder="Email or Phone number" />
        <textarea
          name=""
          id=""
          className="w-full border border-gray"
        ></textarea>
        <button className="bg-primary-color rounded-lg text-lg font-semibold text-white py-1">
          Send
        </button>
      </form>
    </section>
  );
};

export default ContactUs;
